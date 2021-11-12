<template>
  <div class="item-container">
    <Skeleton
      title
      :row="2"
      :loading="!info"
    >
      <div v-if="info" class="item" @click="onSkipDetails">
        <div class="info">
          <div class="username">{{ info.customerName }}</div>
          <div class="label">{{ info.character }}</div>
          <div class="status" :class="{'error-status': info.status === 2}">{{ status }}</div>
        </div>
        <div class="contacts">
          <span class="contacts-name">{{ contacts.name || '暂无' }}</span>
          <div class="last-date">报备时间：{{ info.regDate }}</div>
        </div>
        <div class="error-tips" v-if="info.status === 2">
          <div class="title">驳回原因</div>
          <div class="val">{{ errorAccount }}</div>
        </div>
      </div>
    </Skeleton>
  </div>
</template>

<script>
import { CustomerStatus } from '@/config/config'
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
  data () {
    return {

    }
  },
  computed: {
    status () {
      return this.info ? CustomerStatus[this.info.status] : ''
    },
    contacts () {
      return this.info ? this.info.liaisonList?.find(item => item.mainContact === 0) || {} : {}
    },
    errorAccount () {
      if (this.info.status === 2) {
        return this.info.regLogList[0]?.notes
      } else {
        return ''
      }
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
  margin: 0 .06rem .06rem .06rem;
  border-radius: .06rem;
}
.item {
  display: flex;
  flex-direction: column;
  .info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .username {
      flex: 1;
      color: @titleColor;
      font-size: .14rem;
      margin-right: .12rem;
      .single-row-overstep()
    }
    .label {
      color: #81D3F8;
      border: 1px solid #81D3F8;
      font-size: .12rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: .06rem;
      padding: 0 .06rem;
      margin-right: auto;
    }
    .status {
      margin-left: .12rem;
      .labelStyle();
      &.error-status {
        .errorLabelStyle()
      }
    }
  }
  .contacts {
    margin-top: .16rem;
    display: flex;
    justify-content: space-between;
    color: @textColor;
    font-size: .12rem;
  }
  .error-tips {
    display: flex;
    flex-direction: column;
    font-size: .12rem;
    color: @regColor;
  }
}
</style>
