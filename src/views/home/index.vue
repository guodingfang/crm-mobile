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
        <Filtrate />
      </div>

      <BriefReport />
    </div>
  </div>
</template>

<script>
import UserCard from '@/views/home/components/UserCard'
import ModelItem from '@/views/home/components/ModelItem'
import Filtrate from '@/views/home/components/Filtrate'
import BriefReport from '@/views/home/components/BriefReport'
import { getUserBaseInfo, getUserInfo } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  name: 'index',
  components: {
    UserCard,
    ModelItem,
    BriefReport,
    Filtrate
  },
  data () {
    return {
      userInfo: null,
      modelList: [
        { name: '客户信息', model: 'myClient', backgroundColor: '#ffca78' },
        { name: '客户报备', model: 'clientReport', backgroundColor: '#39aff9' },
        { name: '客户拜访', model: 'clientVisit', backgroundColor: '#7d72f9' },
        { name: '立项跟踪', model: 'projectTrack', backgroundColor: '#ff7173' }
        // { name: '敬请期待', model: 'expect' }
      ]
    }
  },
  mounted () {
    this.getUserBaseInfo()
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
      const {
        code,
        data
      } = await getUserInfo({
        code: userCode || '34548'
      })
      if (code !== 0) return
      this.userInfo = data
      this.setUserInfo(this.userInfo)
    },
    onSkipModel (model) {
      if (model !== 'expect') {
        this.$router.push({ path: model })
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
