<template lang="">
  <div>
    <h1>Test 1 Page</h1>
    <button id="goHomeBtn" @click="$router.push('/home')">Go to Home</button>
    <button id="testBtn" @click="console.log('Click TestBtn')">TestBtn</button>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Test 1 Page Mounted');
});
</script>
<style lang="css" scoped></style>
