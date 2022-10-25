<template>
  <div>
    <HeaderTab currentTab="visitRecord" />
    <div class="tab-container">
      <Tabs
        v-if="isRoles"
        v-model="active"
        swipeable
        title-active-color="#02A7F0"
      >
        <Tab :title="`全部拜访(${totalCount})`">
          <Content v-if="active === 0" content-type="total" />
        </Tab>
        <Tab :title="`我的拜访(${ownerCount})`">
          <Content v-if="active === 1" content-type="owner" />
        </Tab>
        <Tab :title="`下属拜访(${subCount})`">
          <Content v-if="active === 2" content-type="sub" />
        </Tab>
      </Tabs>
      <Content v-else type="owner" />
    </div>
  </div>
</template>

<script>
import HeaderTab from '@/views/client-visit/components/Tab'
import { Tabs, Tab } from 'vant'
import Content from './components/Content'
import { getVisitCount } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  name: 'VisitRecord',
  components: {
    HeaderTab,
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
  watch: {

  },
  mounted () {
    this.getCount()
  },
  async activated () {

  },
  methods: {
    async getCount () {
      const { code, data } = await getVisitCount()
      if (code !== 0) return
      this.ownerCount = data.ownerCount
      this.subCount = data.subCount
      this.totalCount = this.ownerCount + this.subCount
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
      padding-bottom: 0 !important;
    }
    .van-tabs__line {
      background-color: #02A7F0;
      bottom: 0;
    }
  }
}
</style>
