<template>
  <div class="tab-container">
    <Tabs
      v-if="isRoles"
      v-model="active"
      :swipeable="false"
      title-active-color="#02A7F0"
    >
      <Tab :title="`全部订单(${totalCount})`">
        <Content v-if="active === 0" content-type="total" />
      </Tab>
      <Tab :title="`我的订单(${ownerCount})`">
        <Content v-if="active === 1" content-type="owner" />
      </Tab>
      <Tab :title="`下属订单(${subCount})`">
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
import { getProjectCount } from '@/api/week'
export default {
  name: 'ProjectTrack',
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
  mounted () {
    this.getCount()
  },
  computed: {
    ...mapGetters(['userInfo', 'headerHeight']),
    isRoles () {
      const { roles = [] } = this.userInfo
      return roles.includes('CRM大区经理') || roles.includes('CRM管理员') || roles.includes('CRM营销总监')
    }
  },
  methods: {
    async getCount () {
      const { code, data } = await getProjectCount()
      if (code !== 0) return
      this.ownerCount = data.own
      this.subCount = data.other
      this.totalCount = data.all
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
