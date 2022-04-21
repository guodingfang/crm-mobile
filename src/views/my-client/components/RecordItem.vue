<template>
  <div class="item">
    <div class="header">
      <div class="purpose">拜访目的：{{ info.purpose }}</div>
      <div class="time">{{ info.positionTime }}</div>
    </div>
    <div class="content">
      沟通结果：{{ info.result }}
    </div>
    <div class="footer">
      <div class="location">
        <svg-icon name="location" class="icon"></svg-icon>
        <span>{{ info.location }}</span>
      </div>
      <div class="visit-user">
        <svg-icon name="user" class="icon"></svg-icon>
        <span>{{ info.liaisonName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecordItem',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style scoped lang="less">
.item {
  margin-bottom: .06rem;
  display: flex;
  flex-direction: column;
  color: @titleColor;
  background-color: @whiteColor;
  .header {
    display: flex;

    .purpose {
      margin-right: auto;
    }
  }

  .content {
    font-size: .12rem;
    padding: .12rem 0;
  }

  .footer {
    display: flex;
    .location {
      flex: 1;
      color: @textColor;
      margin-right: auto;
    }
    .visit-user {
      margin-left: .08rem;
      color: @textColor;
    }
    .icon {
      color: @linkColor;
    }
  }
}
</style>
