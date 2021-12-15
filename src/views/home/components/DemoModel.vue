<template>
  <div class="model">
    <div class="title">Demo</div>
    <div class="item" @click="onSkipDemoModel">
      progress
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoModel',
  methods: {
    onSkipDemoModel () {
      this.$router.push({ path: '/demo/progress' })
    }
  }
}
</script>

<style lang="less" scoped>
.model {
  padding: .12rem;
  display: flex;
  .item {
    border-radius: .06rem;
    background-color: @whiteColor;
    padding: .12rem;
  }
}
</style>
