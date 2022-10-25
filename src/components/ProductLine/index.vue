<template>
  <dl class="product-line" :class="{'not-edit': !isAllowClick}">
    <div class="mask" v-if="!isAllowClick"></div>
    <dt class="header">
      <h3 class="th">产品线</h3>
      <h3 class="th">客户经理</h3>
      <h3 class="th">业务部门</h3>
    </dt>
    <dd class="row" v-for="item in info" :key="item.lineType">
      <span class="td-select" v-if="isShowSelect" @click="onSelectProduct(item)">
        <svg-icon v-if="item.managerCode !== userInfo.code && item.select" name="forbid" class="forbid-icon"></svg-icon>
        <svg-icon v-else-if="item.select" name="select" class="select-icon selected"></svg-icon>
         <svg-icon v-else name="not-select" class="select-icon not-select"></svg-icon>
      </span>
      <span class="td">{{ item.lineTypeName }}</span>
      <span class="td">{{ item.managerCode ? item.managerName : '' }}</span>
      <span class="td">{{ item.managerCode ? item.orgName : '' }}</span>
    </dd>
  </dl>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  props: {
    info: {
      type: Array,
      default: () => {
        return []
      }
    },
    isShowSelect: {
      type: Boolean,
      default: true
    },
    isAllowClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    onSelectProduct ({ select, managerCode, lineType }) {
      if (select && managerCode !== this.userInfo.code) return
      console.log('lineType', lineType)
      this.$emit('select', lineType)
    }
  }
}
</script>

<style scoped lang="less">
.product-line {
  position: relative;
  margin: .12rem;
  border-radius: .06rem;
  background-color: #ffffff;
  &.not-edit {
    background-color: #fafafa !important;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99;
  }
  .header {
    display: flex;
    height: .36rem;
    padding-left: .36rem;
    .th {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .14rem;
      font-weight: 500;
      color: #02A7F0;
    }
  }
  .row {
    position: relative;
    display: flex;
    height: .36rem;
    padding-left: .36rem;
    border-top: 1px solid #e5e5e5;
    .td-select {
      position: absolute;
      left: 0;
      padding: 0 .12rem;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .select-icon, .forbid-icon {
        color: #999999;
        font-size: .14rem;
        &.selected {
          color: rgb(25, 158, 216);
        }
      }
      .not-select {
        color: #999999;
        font-size: .14rem;
      }
    }
    .td {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .12rem;
      color: #999999;
    }
  }
}
</style>
