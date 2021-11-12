<template>
  <div class="item-container">
    <Skeleton
      title
      :row="2"
      :loading="!info"
    >
      <div class="item" @click="onSkipDetails" v-if="info">
        <div>
          <div class="info-container">
            <div class="info">
              <div class="header">
                <div class="company">
                  {{ info.customerName }}
                </div>
              </div>
              <div class="content">
                <div class="address">
                  <svg-icon class="icon" name="location"></svg-icon>
                  {{ info.province }}{{ info.city }}{{ info.address }}
                </div>
              </div>
            </div>
            <div class="label" :class="info.characterCode">{{ info.character }}</div>
          </div>
          <div class="footer">
            <div class="info">
              <span class="username">
                <svg-icon class="icon" name="user"></svg-icon>
                {{ liaisonUser.name || '无联系人' }}
              </span>

              <span class="tel">
                <svg-icon class="icon" name="tel"></svg-icon>
                {{ liaisonUser.phoneNum || '无电话' }}
              </span>
            </div>
            <div class="last-date">近一月拜访{{ info.visitLogList.length }}次</div>
          </div>
        </div>
      </div>
    </Skeleton>
  </div>
</template>

<script>
import { Skeleton } from 'vant'
export default {
  name: 'Item',
  components: {
    Skeleton
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  computed: {
    liaisonUser () {
      const user = this.info ? this.info.liaisonList.find(item => item.mainContact === 0) : {}
      return user || {}
    }
  },
  methods: {
    onSkipDetails () {
      if (!this.info) return
      const { id } = this.info
      this.$emit('skip', { customerId: id })
    }
  }
}
</script>

<style scoped lang="less">
.item-container {
  background: @cardBg;
  padding: .12rem;
  margin-bottom: .06rem;
  border-radius: .06rem;
}
.item {
  display: flex;
  flex-direction: column;
  .info-container {
    display: flex;
    align-items: flex-start;
    .info {
      flex: 1;
      .header {
        display: flex;
        justify-content: space-between;
        .company {
          color: @titleColor;
          font-size: .14rem;
          .single-row-overstep()
        }
      }
      .content {
        padding: .12rem 0;
        .address {
          font-size: .12rem;
          max-height: .36rem;
          line-height: .18rem;
          .two-row-overstep();
        }
      }
    }
    .label {
      margin-left: .12rem;
      width: .38rem;
      //height: .38rem;
      &.KHXZ01 {
        .labelStyle(#ffcd96, #fc9c3e)
      }
      &.KHXZ02 {
        .labelStyle(#b3e3a7, #69b528)
      }
      &.KHXZ03 {
        .labelStyle(#d2f0fc, #34c5f4)
      }
      &.KHXZ04 {
        .labelStyle(#d3aafa, #a345f9)
      }
      &.KHXZ05 {
        .labelStyle(#f2abb4, #ec6c7f)
      }
      &.KHXZ06 {
        .labelStyle(#e5eaeb, #828282)
      }
    }
  }
  .footer {
    font-size: .12rem;
    display: flex;
    .username {
      color: @titleColor;
      margin-right: .12rem;
    }
    .tel {
      color: @titleColor;
      margin-right: .12rem;
    }
    .last-date {
      margin-left: auto;
      color: @textColor;
    }
  }
  .icon {
    color: @linkColor;
  }
}
</style>
