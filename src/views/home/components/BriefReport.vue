<template>
  <div class="list">
    <div class="item">
      <div class="val">{{ weekVisitAmount }}</div>
      <div class="label">本周行动次数</div>
    </div>
    <div class="item">
      <div class="val">{{ monthVisitAmount }}</div>
      <div class="label">本月行动次数</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BriefReport',
  props: {
    weekVisitAmount: Number,
    monthVisitAmount: Number
  }
}
</script>

<style scoped lang="less">
.list {
  display: flex;
  background-color: @whiteColor;
  border-radius: .06rem;
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: .64rem;
    .val {
      color: @titleColor;
      font-size: .16rem;
    }
    .label {
      margin-top: .06rem;
      color: @linkColor;
      font-size: .12rem;
    }
  }
}
</style>
