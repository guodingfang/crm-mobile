<template>
  <div class="item-container">
    <SwipeCell ref="swipe" :disabled="!isManagerUser">
      <Skeleton
        title
        :row="2"
        :loading="!info"
      >
        <div class="item" @click="onSkipDetails" v-if="info">
          <div class="info">
            <div class="header">
              <div class="company" :class="{'company-padding': info.star === '1' && isManagerUser}">{{ info.customerName }}</div>
              <div class="start-company" v-if="info.star === '1' && isManagerUser">
                <Icon name="star" />
              </div>
              <div class="label" :class="info.characterCode">{{ info.character }}</div>
            </div>
            <div class="content">
              <div class="address">
                <svg-icon class="icon" name="location"></svg-icon>
                {{ info.province }}{{ info.city }}{{ info.address }}
              </div>
              <div class="user-info">
                <span class="username">
                  <svg-icon class="icon" name="user"></svg-icon>
                  {{ liaisonUser.name || '无联系人' }}
                </span>
                <span class="tel">
                  <svg-icon class="icon" name="tel"></svg-icon>
                  {{ liaisonUser.phoneNum || '无电话' }}
                </span>
                <span class="manager">{{ manager }}</span>
              </div>
            </div>
            <div class="footer">
              <div class="last-date">最近拜访 {{ info.visitDate || '-' }}</div>
              <div class="visi-amount">【近一月拜访{{ info.visitLogList ? info.visitLogList.length : 0 }}次】</div>
            </div>
          </div>
        </div>
      </Skeleton>
      <template #right>
        <div class="star-btn" :class="{'selected-btn': info.star === '1'}" v-if="info" @click.stop="onStar()">
          <Icon name="star" v-if="info.star === '1'"/>
          <Icon name="star-o" v-else />
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script>
import { Skeleton, SwipeCell, Icon } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'Item',
  components: {
    Skeleton,
    SwipeCell,
    Icon
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
    ...mapGetters(['userInfo']),
    liaisonUser () {
      const user = this.info && this.info.liaisonList
        ? this.info.liaisonList.find(item => item.mainContact === 0)
        : {}
      return user || {}
    },
    manager () {
      if (!this.info) return ''
      const managerItem = this.info.managerList.find(item => item.owner === 0)
      return managerItem ? managerItem.managerName : ''
    },
    isManagerUser () {
      if (!this.info) return ''
      return this.info.managerList.find(item => item.managerCode === this.userInfo.code)
    }
  },
  methods: {
    onSkipDetails () {
      if (!this.info) return
      const { id } = this.info
      this.$emit('skip', { customerId: id })
    },
    onStar () {
      this.$emit('star', {
        id: this.info.id,
        star: this.info.star === '1' ? '0' : '1'
      })
      this.$refs.swipe.close()
    }
  }
}
</script>

<style scoped lang="less">
.item-container {
  background: @cardBg;
  margin-bottom: .06rem;
  border-radius: .06rem;
  /deep/ .van-skeleton__content {
    padding: 0.12rem 0;
  }
}
.item {
  display: flex;
  flex-direction: column;
  padding: .12rem;
  .info {
    flex: 1;
    .header {
      position: relative;
      display: flex;
      justify-content: space-between;
      .start-company {
        position: absolute;
        left: -.34rem;
        top: -.14rem;
        width: .65rem;
        height: .25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(-45deg);
        background-color: #f59a23;
        .van-icon {
          color: #ffffff;
        }
      }
      .company {
        flex: 1;
        color: @titleColor;
        font-size: .14rem;
        height: .24rem;
        line-height: .24rem;
        .single-row-overstep();
        &.company-padding {
          margin-left: .12rem;
        }
      }
      .label {
        width: .7rem;
        font-size: .1rem;
        text-align: center;
        .characterLabel()
      }
    }
    .content {
      padding: .06rem 0 .1rem 0;
      .address {
        font-size: .12rem;
        max-height: .36rem;
        line-height: .18rem;
        .two-row-overstep();
      }
      .user-info {
        display: flex;
        margin-top: .1rem;
        .username {
          font-size: .12rem;
          color: @titleColor;
          margin-right: .12rem;
        }
        .tel {
          font-size: .12rem;
          color: @titleColor;
          margin-right: .12rem;
        }
        .manager {
          font-size: .12rem;
          color: @tipsColor;
          margin-left: auto;
          margin-right: 0.06rem;
        }
      }
    }
  }
  .footer {
    padding-top: .12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid @pageBgColor;
    font-size: .1rem;
    color: @textColor;
  }
  .icon {
    color: @linkColor;
  }
}
.star-btn {
  min-width: 100%;
  width: .6rem;
  height: 100%;
  color: #f59a23;
  font-size: .24rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f59a23;
  border-radius: .06rem;
  &.selected-btn {
    background-color: #f59a23;
    color: @whiteColor;
  }
  /deep/ .van-button {
    height: 100%;
  }
}
</style>
