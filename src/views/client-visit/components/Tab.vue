<template>
  <div class="tab-container">
    <div class="tab">
      <div class="tab-item" :class="{'select-tab-item': currentTab === 'outClock' }" @click="selectTab('outClock')">拜访定位</div>
      <div class="tab-item" :class="{'select-tab-item': currentTab === 'visitRecord' }" @click="selectTab('visitRecord')">拜访记录</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    currentTab: {
      type: String,
      default: ''
    }
  },
  methods: {
    selectTab (name) {
      if (!this.currentTab) return
      if (name === this.currentTab) return
      this.$router.replace({ name })
    }
  }
}
</script>

<style scoped lang="less">
.tab-container {
  height: .4rem;
}
.tab {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  height: .4rem;
  align-items: center;
  justify-content: center;
  background-color: @whiteColor;
  .tab-item {
    font-size: .14rem;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @textColor;
    &.select-tab-item {
      color: @linkColor;
    }
  }
  .tab-item + .tab-item {
    border-left: 1px solid #e5e5e5;
  }
}
</style>
