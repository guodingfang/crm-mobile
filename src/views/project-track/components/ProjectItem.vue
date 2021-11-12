<template>
  <div class="item" @click="onSkipProject">
    <div class="header">
      <div class="code">
        <div class="label">项目编号</div>
        <div class="val">TY7180002</div>
      </div>
      <div class="status">售前状态</div>
    </div>
    <div class="content">
      <div class="name">
        <div class="label">项目名称</div>
        <div class="val">市场拓展-迎泽区网格化现场会</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  methods: {
    onSkipProject () {
      this.$emit('skip')
    }
  }
}
</script>

<style scoped lang="less">
.item {
  display: flex;
  flex-direction: column;
  color: @titleColor;
  font-size: .12rem;
  background: @cardBg;
  padding: .12rem;
  .header {
    display: flex;
    justify-content: space-between;
    height: .24rem;
    margin-bottom: .12rem;
    .code {
      display: flex;
    }
    .status {
      .labelStyle()
    }
  }
  .content {
    .name {
      display: flex;
    }
  }
}
</style>
