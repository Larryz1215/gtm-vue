<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding-top: 20px;
}
</style>
