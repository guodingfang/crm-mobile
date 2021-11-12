<template>
  <div
    class="model"
    :class="{'main-model': info.mainContact === 0}"
    @click="onEdit"
  >
    <div class="info">
      <div class="user info-item">
        <svg-icon class="icon" name="user"></svg-icon>
        <div class="user-val">{{ info.name }}</div>
      </div>
      <div class="tel info-item">
        <svg-icon class="icon" name="tel"></svg-icon>
        <div class="tel-val">{{ info.phoneNum }}</div>
      </div>
    </div>
    <div class="footer">
      <div class="dep info-item">
        <svg-icon class="icon" name="dep"></svg-icon>
        <div class="dep-val">
          {{ info.orgName }}-{{ info.job }}
        </div>
      </div>
      <svg-icon class="icon-more" name="more"></svg-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Model',
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  methods: {
    onEdit () {
      this.$emit('edit', this.info)
    }
  }
}
</script>

<style scoped lang="less">
.model {
  height: .64rem;
  background-color: @cardBg;
  display: flex;
  flex-direction: column;
  padding: .1rem .12rem .1rem .05rem;
  box-sizing: border-box;
  justify-content: space-between;
  border-left: .08rem solid transparent;
  &.main-model {
    border-left-color: @linkColor;
  }
  .info {
    display: flex;
    align-items: center;
    .user {
      color: @titleColor;
    }
    .tel {
      margin-left: auto;
      color: @titleColor;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    .icon-more {
      margin-left: auto;
      color: @linkColor;
    }
  }
  .info-item {
    display: flex;
    align-items: center;
    font-size: .14rem;
    color: @textColor;
    .icon {
      margin-right: .06rem;
      font-size: .12rem;
      color: @linkColor;
    }
  }
}
</style>
