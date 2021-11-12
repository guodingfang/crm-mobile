<template>
  <div class="loading">
    <Loading type="spinner" color="#1989fa" />
  </div>
</template>

<script>
import { Loading } from 'vant'
export default {
  name: 'LoadingIndex',
  components: {
    Loading
  }
}
</script>

<style scoped lang="less">
.loading {
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
