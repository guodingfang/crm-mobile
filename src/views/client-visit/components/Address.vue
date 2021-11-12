<template>
  <div class="address">
    <div class="address-icon">
      <svg-icon name="location"></svg-icon>
    </div>
    <div class="address-val">
      地址：{{address}}
    </div>
    <div class="again-location" @click="onAgainLocation">刷新定位</div>
  </div>
</template>

<script>
export default {
  name: 'Address',
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  methods: {
    onAgainLocation () {
      this.$emit('again')
    }
  }
}
</script>

<style scoped lang="less">
.address {
  background: @cardBg;
  margin: -.24rem .24rem 0 .24rem;
  display: flex;
  align-items: center;
  height: .48rem;
  border-radius: .48rem;
  padding: 0 .12rem;
  box-sizing: border-box;
  box-shadow:  0 2px 10px rgba(0, 0, 0, .15);
  position: relative;
  z-index: 999;
  .address-icon {
    color: @linkColor;
    margin-right: .06rem;
  }
  .address-val {
    flex: 1;
    color: @titleColor;
    font-size: .12rem;
    .two-row-overstep()
  }
  .again-location {
    width: .6rem;
    margin-left: auto;
    font-size: .12rem;
    color: @linkColor;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
