<template>
  <div class="company-item" @click="onSkipDetails">
    <div class="hav-exists" v-if="info.exists">现存</div>
    <div class="company-name" :class="{'company-name-left': info.exists}" v-html="info.name"></div>
    <div class="status open-status" :class="statusMap">{{ info.regStatus }}</div>
    <div class="company-info">
      <div class="info-item company-user">
        <div class="label">法定代表人</div>
        <div class="value">{{ info.legalPersonName }}</div>
      </div>
      <div class="info-item created">
        <div class="label">成立时间</div>
        <div class="value">{{ createDate }}</div>
      </div>
      <div class="info-item register-money">
        <div class="label">{{ info.regCapitalShowStr }}</div>
        <div class="value">{{ info.regCapital }}</div>
      </div>
    </div>
<!--    <div class="manager">-->
<!--      <span>客户经理：</span>-->
<!--      <span>刘宁宁</span>-->
<!--    </div>-->
    <div class="address" v-if="info.regLocation">
      <span>详细地址：</span>
      <span v-html="info.regLocation"></span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Toast } from 'vant'
export default {
  name: 'CompanyItem',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    createDate () {
      return this.info.estiblishTime !== '-' ? moment(this.info.estiblishTime).format('YYYY-MM-DD') : '-'
    },
    statusMap () {
      const map = {
        吊销: 'close-status',
        停业: 'close-status',
        注销: 'close-status',
        撤销: 'close-status',
        正常: 'open-status',
        存续: 'open-status',
        在业: 'open-status',
        开业: 'open-status',
        迁入: 'open-status',
        迁出: 'open-status'
      }
      return map[this.info.regStatus] || 'warning-status'
    }
  },
  methods: {
    onSkipDetails () {
      if (this.info.exists && this.info.type !== 1) {
        Toast('客户报备中，无法重复报备')
        return
      }
      if (this.info.regStatus === '正常' || this.info.regStatus === '存续' || this.info.regStatus === '在业' || this.info.regStatus === '开业' || this.info.regStatus === '迁入' || this.info.regStatus === '迁出') {
        this.$router.push({ name: 'clientReportDetails', query: { cid: this.info.id, exists: this.info.exists } })
      } else {
        Toast('请选择正常、存续客户进行报备')
      }
    }
  }
}
</script>

<style scoped lang="less">
.company-item {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: @cardBg;
  margin: .12rem;
  padding: .12rem;
  border-radius: .06rem;
  overflow: hidden;
  .hav-exists {
    position: absolute;
    left: -.34rem;
    top: -.26rem;
    width: .65rem;
    height: .55rem;
    padding-top: .32rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-45deg);
    background-color: #81d3f8;
    font-size: .12rem;
    color: #ffffff;
  }
  .company-name {
    padding-right: .36rem;
    font-size: .16rem;
    font-weight: 500;
    max-height: .44rem;
    .two-row-overstep();
    &.company-name-left {
      text-indent: .12rem
    }
  }
  .status {
    position: absolute;
    right: .12rem;
    top: .12rem;
    font-size: .12rem;
    padding: .03rem .06rem;
    border-radius: .03rem;
    &.open-status {
      background-color: rgb(204, 239, 217);
      color: rgb(4, 165, 65);
    }
    &.close-status {
      background-color: rgb(255, 220, 219);
      color: rgb(237, 81, 80);
    }
    &.warning-status {
      background-color: rgb(255, 247, 219);
      color: rgb(237, 179, 80);
    }
  }
  .company-info {
    margin-top: .12rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: .06rem;
    .info-item {
      height: .36rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: @textColor;
      font-size: .12rem;
      &.company-user {
        width: .68rem;
        .value {
          color: rgb(98, 115, 199);
          font-weight: 500;
        }
      }
      &.created {
        width: 1rem;
        padding: 0 .06rem 0 .12rem;
        box-sizing: border-box;
      }
      &.register-money {
        width: 1.4rem;
        padding: 0 .12rem;
        box-sizing: border-box;
        .value {
          .single-row-overstep()
        }
      }
      .value {
        color: @titleColor;
        font-size: .14rem;
        font-weight: 500;
      }
    }
    .info-item + .info-item {
      border-left: 1px solid @textColor;
    }
  }
  .manager,
  .address {
    margin-top: .06rem;
    font-size: .12rem;
    color: @titleColor;
    max-height: .36rem;
    .two-row-overstep()
  }
}
</style>
