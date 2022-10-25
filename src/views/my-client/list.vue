<template>
  <div class="tab-container">
    <Tabs
      v-if="isRoles"
      v-model="active"
      :swipeable="false"
      title-active-color="#02A7F0"
    >
      <Tab :title="`全部客户(${totalCount})`">
        <Content v-if="active === 0" content-type="total" />
      </Tab>
      <Tab :title="`我的客户(${ownerCount})`">
        <Content v-if="active === 1" content-type="owner" />
      </Tab>
      <Tab :title="`下属客户(${subCount})`">
        <Content v-if="active === 2" content-type="sub" />
      </Tab>
    </Tabs>
    <Content v-else type="total" />
  </div>
</template>

<script>
import { Tabs, Tab } from 'vant'
import Content from './components/Content'
import { mapGetters } from 'vuex'
import { getCustomerCount } from '@/api/customer'

export default {
  name: 'MyClientList',
  components: {
    Tabs,
    Tab,
    Content
  },
  data () {
    return {
      active: 0,
      ownerCount: 0,
      subCount: 0,
      totalCount: 0
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'headerHeight']),
    isRoles () {
      const { roles = [] } = this.userInfo
      return roles.includes('CRM大区经理') || roles.includes('CRM管理员') || roles.includes('CRM营销总监')
    }
  },
  mounted () {
    this.getCount()
  },
  activated () {

  },
  methods: {
    async getCount () {
      const { code, data } = await getCustomerCount({ status: '1' })
      if (code !== 0) return
      const { ownerCount = 0, subCount = 0 } = data
      this.ownerCount = ownerCount
      this.subCount = subCount
      this.totalCount = ownerCount + subCount
    }
  }
}
</script>

<style scoped lang="less">
.tab-container {
  /deep/ .van-tabs {
    .van-tabs__nav {
      position: fixed;
      width: 100%;
      height: 0.44rem;
      z-index: 999;
    }
    .van-tabs__line {
      background-color: #02A7F0;
    }
  }
}
</style>
