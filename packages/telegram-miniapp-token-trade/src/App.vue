<template>
  <header>
    <van-tabbar v-model="active" :fixed="true" :safe-area-inset-bottom="true">
      <van-tabbar-item icon="home-o" to="/">交易</van-tabbar-item>
      <van-tabbar-item icon="gold-coin" to="/auto-trade">挂单</van-tabbar-item>
    </van-tabbar>
  </header>

  <RouterView />
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  data() {
    return {
      name: '',
    }
  },

  setup() {
    const active = ref(0)
    return { active }
  },
}
</script>

<style lang="less">
header {
  nav {
    display: flex;
  }

  .router-link {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    text-decoration: none;
    border: 1px solid;
  }
}
</style>
