<template lang="">
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
import { onMounted, reactive, onUnmounted } from 'vue'
import { useGtm } from '@gtm-support/vue-gtm'
import { ElMessage } from 'element-plus'

const gtm = useGtm()

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

onMounted(() => {
  console.log('Test 1 Page Mounted')

  // 監聽 ElMessage 的 DOM 變化
  setupMessageObserver()
})

// DOM 監聽器，用於監聽所有 ElMessage 的出現和消失
const setupMessageObserver = () => {
  // 監聽 ElMessage 容器的變化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          // 檢查是否是 ElMessage 元素
          if (element.classList?.contains('el-message')) {
            handleMessageAdded(element)
          }
          // 也檢查子元素中是否有 ElMessage
          const messages = element.querySelectorAll?.('.el-message')
          messages?.forEach(handleMessageAdded)
        }
      })

      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element
          if (element.classList?.contains('el-message')) {
            handleMessageRemoved(element)
          }
        }
      })
    })
  })

  // 開始觀察 document.body 的變化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // 在組件卸載時停止觀察
  onUnmounted(() => {
    observer.disconnect()
  })
}

// 處理 ElMessage 出現
const handleMessageAdded = (element: Element) => {
  const messageText = element.querySelector('.el-message__content')?.textContent || ''
  const messageType = getMessageType(element)

  console.log('ElMessage appeared:', messageText, messageType)

  gtm?.push({
    event: 'ui_message_displayed',
    message: {
      type: messageType,
      content: messageText,
      timestamp: new Date().toISOString()
    }
  })
}

// 處理 ElMessage 消失
const handleMessageRemoved = (element: Element) => {
  const messageText = element.querySelector('.el-message__content')?.textContent || ''
  const messageType = getMessageType(element)

  console.log('ElMessage disappeared:', messageText, messageType)

  gtm?.push({
    event: 'ui_message_dismissed',
    message: {
      type: messageType,
      content: messageText,
      timestamp: new Date().toISOString()
    }
  })
}

// 獲取 ElMessage 的類型
const getMessageType = (element: Element): string => {
  if (element.classList.contains('el-message--success')) return 'success'
  if (element.classList.contains('el-message--warning')) return 'warning'
  if (element.classList.contains('el-message--info')) return 'info'
  if (element.classList.contains('el-message--error')) return 'error'
  return 'unknown'
}
</script>
<style lang="css" scoped></style>
