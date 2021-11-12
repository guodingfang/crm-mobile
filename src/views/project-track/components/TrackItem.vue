<template>
  <div class="item">
    <div class="header">
      <div class="title">2021年第38周</div>
      <div class="status">赢率</div>
    </div>
    <div class="content">
      <p>
        本周进展内容本周进展内容本周进展内容本周进展内容本周进展
        本周进展内容本周进展内容本周进展内容本周进展内容本周进展
        本周进展内容本周进展内容本周进展内容本周进展内容本周…
      </p>
    </div>
    <div class="footer">
      <div class="user">填写人：小王</div>
      <div class="time">填写时间：2020-01-01</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrackItem'
}
</script>

<style scoped lang="less">
.item {
  display: flex;
  flex-direction: column;
  background-color: @cardBg;
  border-radius: .06rem;
  padding: .12rem;
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
