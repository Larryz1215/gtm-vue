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
import { onMounted, reactive } from 'vue'
import { useGtm } from '@gtm-support/vue-gtm'
import { ElMessage } from 'element-plus'

const gtm = useGtm()

const form = reactive({
  name: '',
  email: ''
})


const onSubmit = () => {
  gtm?.push({
    event: 'formSubmission',
    form: {
      name: form.name,
      email: form.email
    }
  })
  ElMessage({
    message: 'Form submitted successfully!',
    type: 'success'
  })
  console.log('Form submitted', form)
}

const showMessage = () => {
  gtm?.push({
    event: 'testButtonClick'
  })
  ElMessage({
    message: 'Click TestBtn!',
    type: 'success'
  })
}

onMounted(() => {
  console.log('Test 1 Page Mounted')
})
</script>
<style lang="css" scoped></style>
