<template>
  <div class="container">
    <Empty
      class="custom-image"
      image="network"
      description="找不到页面了，404"
    ></Empty>
  </div>
</template>

<script>
import { Empty } from 'vant'
export default {
  name: '404',
  components: {
    Empty
  }
}
</script>

<style scoped lang="less">
.container {
  background-color: @whiteColor;
  min-height: calc(100vh - .46rem);
  .custom-image .van-empty__image {
    width: .9rem;
    height: .9rem;
  }
}

</style>
