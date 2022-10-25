<template>
  <div class="item" @click="onSkipWeekItem">
    <div class="header">
      <div class="title">2021年第{{ info.weekNum }}周</div>
      <div class="status">赢率{{ info.winRate }}%</div>
    </div>
    <div class="content">
      <p>
        {{ info.weeklyTask }}
      </p>
    </div>
    <div class="footer">
      <div class="user">填写人：{{ info.creater }}</div>
      <div class="time">填写时间：{{ info.createDate }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrackItem',
  props: {
    info: Object
  },
  methods: {
    onSkipWeekItem () {
      this.$emit('skip')
    }
  }
}
</script>

<style scoped lang="less">
.item {
  display: flex;
  flex-direction: column;
  background-color: @cardBg;
  border-radius: .06rem;
  padding: .12rem;
  margin: 0 .06rem .06rem .06rem;
  .header {
    display: flex;
    .title {
      font-size: .14rem;
      margin-right: auto;
    }
    .status {
      .labelStyle(#81D3F8, #02A7F0)
    }
  }
  .content {
    margin: .06rem 0;
    p {
      margin: 0;
      font-size: .12rem;
      color: @textColor;
      .three-row-overstep();
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    font-size: .12rem;
    color: @textColor;
  }
}
</style>
