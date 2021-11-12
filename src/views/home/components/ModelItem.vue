<template>
  <div class="func-model" @click="onSkipModel">
    <div class="icon-container" :style="{background: info.backgroundColor}">
      <svg-icon :name="info.model" :class="info.model" class="model-icon"></svg-icon>
    </div>
    <span class="title">{{ info.name }}</span>
  </div>
</template>

<script>
export default {
  name: 'ModelItem',
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  methods: {
    onSkipModel () {
      const { model = '' } = this.info
      this.$emit('skip', model)
    }
  }
}
</script>

<style lang="less" scoped>
.func-model {
  background: @cardBg;
  height: .86rem;
  padding: .06rem .12rem;
  border-radius: .06rem;
  box-shadow: @card-shadow;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .icon-container {
    width: .5rem;
    height: .5rem;
    background-color: #e5e5e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .model-icon {
      font-size: .26rem;
      color: @whiteColor;
      &.projectTrack {
        font-size: .24rem;
      }
    }
  }
  .title {
    font-size: .12rem;
    color: @titleColor;
  }
}
</style>
