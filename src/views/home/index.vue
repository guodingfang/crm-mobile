<template>
  <div>
    <UserCard :user-info="userInfo" />
    <div class="model func-model">
      <h3 class="model-title">常用功能</h3>
      <div class="model-list" >
        <ModelItem
          class="model-item"
          v-for="(item, index) in modelList"
          :key="index"
          :info="item"
          @skip="onSkipModel"
        />
      </div>
    </div>

    <div class="model">
      <div class="model-header">
        <h3 class="model-title">行动简报</h3>
<!--        <Filtrate />-->
      </div>

      <BriefReport :week-visit-amount="weekVisitAmount" :month-visit-amount="monthVisitAmount" />
    </div>

    <DemoModel v-if="false"/>
  </div>
</template>

<script>
import UserCard from '@/views/home/components/UserCard'
import ModelItem from '@/views/home/components/ModelItem'
import Filtrate from '@/views/home/components/Filtrate'
import BriefReport from '@/views/home/components/BriefReport'
import DemoModel from '@/views/home/components/DemoModel'
import { getRoles, getUserAvatar, getUserBaseInfo, getUserInfo } from '@/api/user'
import { mapActions } from 'vuex'
import { queryVisitNum } from '@/api/visit'
import { Toast } from 'vant'
export default {
  name: 'index',
  components: {
    UserCard,
    ModelItem,
    BriefReport,
    // eslint-disable-next-line vue/no-unused-components
    Filtrate,
    DemoModel
  },
  data () {
    return {
      userInfo: null,
      weekVisitAmount: 0,
      monthVisitAmount: 0,
      modelList: [
        { name: '客户报备', model: 'clientReport', backgroundColor: '#39aff9' },
        { name: '客户信息', model: 'myClient', backgroundColor: '#ffca78' },
        { name: '客户拜访', model: 'clientVisit', backgroundColor: '#7d72f9' },
        { name: '跟踪周报', model: 'projectTrack', backgroundColor: '#ff7173' }
        // { name: '敬请期待', model: 'expect' }
      ]
    }
  },
  async mounted () {
    await this.getUserBaseInfo()
  },
  async activated () {
    await this.getVisitAmount()
  },
  methods: {
    ...mapActions('user', ['setUserInfo']),

    async getUserBaseInfo () {
      try {
        const { userCode = '' } = await getUserBaseInfo()
        await this.getUserInfo({ userCode })
      } catch (err) {
        await this.getUserInfo({})
      }
    },
    async getUserInfo ({ userCode = '' }) {
      const params = { code: userCode || '32129' }
      const { code, data } = await getUserInfo(params)
      if (code !== 0) return
      if (process.env.NODE_ENV !== 'development') {
        try {
          await getUserAvatar({
            path: data.avatar
          })
          this.userInfo = {
            ...data,
            avatar: `${window.crmPrefix}/Services/avater?path=${data.avatar}`
          }
        } catch (err) {
          this.userInfo = data
        }
      } else {
        this.userInfo = data
      }

      const rolesRes = await getRoles(params)
      this.setUserInfo({
        ...this.userInfo,
        roles: rolesRes.data.map(item => item.roleName)
      })
    },
    onSkipModel (model) {
      if (model !== 'expect') {
        this.$router.push({ name: model })
      }
    },
    async getVisitAmount () {
      const { code, data = {}, msg } = await queryVisitNum()
      if (code !== 0) {
        Toast(msg)
      } else {
        const { weekNum = 0, monthNum = 0 } = data || {}
        this.weekVisitAmount = weekNum
        this.monthVisitAmount = monthNum
      }
    }
  }
}
</script>

<style scoped lang="less">
.model {
  width: 100%;
  flex-direction: column;
  padding: 0 .12rem;
  box-sizing: border-box;
  .model-header {
    display: flex;
    align-items: center;
  }
  .model-title {
    margin-right: auto;
    font-size: .16rem;
    font-weight: bold;
    height: .36rem;
    line-height: .36rem;
  }
  .model-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .model-item {
      flex: 1;
      margin-bottom: .12rem;
      &:not(:last-child) {
        margin-right: .12rem;
      }
    }
  }
}

</style>
