<template>
  <div>
    <h1>Test 1 Page</h1>
    <el-button type="primary" id="goHomeBtn" @click="$router.push('/home')">Go to Home</el-button>
    <el-button type="primary" id="testBtn" @click="showMessage()">TestBtn</el-button>
  </div>
  <div style="width: 300px; margin-top: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; background-color: #ACD6FF;border-radius: 10px;">
    <el-form model="form"  label-width="50px">
      <el-form-item label="Name:">
        <el-input id="name" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Email:">
        <el-input id="email" v-model="form.email"></el-input>
      </el-form-item>
      <div style="display: flex; justify-content: center;">
        <el-button id="submitBtn" @click="onSubmit()">Submit</el-button>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, onUnmounted, ref } from 'vue'
import { useGtm } from '@gtm-support/vue-gtm'
import { ElMessage } from 'element-plus'

const gtm = useGtm()

// 簡單的時間追蹤
const pageStartTime = ref<number>(0)
let timer30s: number | null = null

const form = reactive({
  name: '',
  email: ''
})


const onSubmit = () => {
  // 表單提交的 GTM 事件
  gtm?.push({
    event: 'formSubmission',
    form: {
      name: form.name,
      email: form.email
    }
  })

  // 使用包裝函數顯示訊息（會自動追蹤）
  showTrackedMessage({
    message: 'Form submitted successfully!',
    type: 'success',
    context: 'form_submission'
  })

  console.log('Form submitted', form)
}

const showMessage = () => {
  gtm?.push({
    event: 'testButtonClick'
  })

  // 使用包裝函數顯示訊息（會自動追蹤）
  showTrackedMessage({
    message: 'Click TestBtn!',
    type: 'success',
    context: 'test_button'
  })
}

// 創建包裝函數來統一管理 ElMessage 和 GTM 追蹤
const showTrackedMessage = (options: {
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  context?: string
}) => {
  const { message, type = 'info', duration = 3000, context = 'general' } = options

  // 記錄訊息顯示事件
  gtm?.push({
    event: 'tracked_message_show',
    message: {
      content: message,
      type: type,
      context: context,
      timestamp: new Date().toISOString()
    }
  })

  // 顯示 ElMessage
  const messageInstance = ElMessage({
    message,
    type,
    duration,
    onClose: () => {
      // 記錄訊息關閉事件
      gtm?.push({
        event: 'tracked_message_close',
        message: {
          content: message,
          type: type,
          context: context,
          timestamp: new Date().toISOString()
        }
      })
      console.log(`${type} message closed:`, message)
    }
  })

  return messageInstance
}

// 開始時間追蹤
const startTimeTracking = () => {
  pageStartTime.value = Date.now()
  console.log('開始追蹤頁面停留時間')
  
  // 發送頁面進入事件
  gtm?.push({
    event: 'page_enter',
    page: {
      name: 'test1',
      path: '/test1',
      timestamp: new Date().toISOString()
    }
  })
  
  // 設定30秒計時器
  timer30s = window.setTimeout(() => {
    gtm?.push({
      event: 'page_stay_long',
      page: {
        name: 'test1',
        path: '/test1',
        duration_seconds: 30,
        duration_category: 'long_stay',
        timestamp: new Date().toISOString()
      }
    })
    console.log('使用者停留超過30秒')
  }, 30000) // 30秒
}

// 結束時間追蹤
const endTimeTracking = () => {
  if (pageStartTime.value === 0) return
  
  const endTime = Date.now()
  const stayDuration = endTime - pageStartTime.value
  const staySeconds = Math.round(stayDuration / 1000)
  
  // 清除30秒計時器
  if (timer30s) {
    clearTimeout(timer30s)
    timer30s = null
  }
  
  // 判斷停留時間類別
  let durationCategory = 'normal_stay'
  if (staySeconds < 5) {
    durationCategory = 'short_stay'
    
    // 發送短停留事件
    gtm?.push({
      event: 'page_stay_short',
      page: {
        name: 'test1',
        path: '/test1',
        duration_seconds: staySeconds,
        duration_category: 'short_stay',
        timestamp: new Date().toISOString()
      }
    })
    console.log(`使用者停留不到5秒 (${staySeconds}秒)`)
  } else if (staySeconds >= 30) {
    durationCategory = 'long_stay'
  }
  
  // 發送頁面離開事件
  gtm?.push({
    event: 'page_exit',
    page: {
      name: 'test1',
      path: '/test1',
      duration_seconds: staySeconds,
      duration_category: durationCategory,
      timestamp: new Date().toISOString()
    }
  })
  
  console.log(`頁面停留時間: ${staySeconds}秒 (${durationCategory})`)
}

onMounted(() => {
  console.log('Test 1 Page Mounted')
  startTimeTracking()
})

onUnmounted(() => {
  endTimeTracking()
})

</script>
<style lang="css" scoped></style>
