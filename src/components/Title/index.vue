<template>
  <div class="title">
    <slot name="prefix" v-if="isPrefix">
      <div class="decorate"></div>
    </slot>
    <h5 class="title-val">{{title}}</h5>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    isPrefix: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="less">
.title {
  height: .3rem;
  display: flex;
  align-items: center;
  .decorate {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FFA500;
    margin-right: .06rem;
  }
  .title-val {
    color: #999;
  }
}
</style>
