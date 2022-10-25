<template>
  <div>
    <div class="competitor-container">
      <div class="competitor-list">
        <SwipeCell class="competitor-item" v-for="competitor in competitorList" :key="competitor.id">
          <div class="competitor-name">{{ competitor.competitorName }}</div>
          <template #right>
            <div class="del-contacts" @click.stop="onDelCompetitor(competitor)">
              删除
            </div>
          </template>
        </SwipeCell>
      </div>
    </div>
    <Footer
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
      @confirm="onConfirm"
      @add="onAddCompetitor"
    />
    <Pop
      :showPop.sync="showPop"
      :selectCompetitorList="competitorList"
      @updateCompetitor="onUpdateCompetitor"
    />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import Pop from './components/CompetitorPopup'
import { SwipeCell, Toast } from 'vant'
import { delMappingCompetitor, getCompetitorList, mappingCompetitor } from '@/api/competitor'
export default {
  components: {
    Footer,
    Pop,
    SwipeCell
  },
  data () {
    return {
      projectId: '',
      showPop: false,
      competitorList: [],
      btnList: [
        { status: 'btn1', name: '保存', type: 'confirm' },
        { status: 'btn2', name: '关联', type: 'add' }
      ],
      isAllowClick: true
    }
  },
  mounted () {
    this.projectId = this.$route.query.projectId
    this._getCompetitorList()
  },
  methods: {
    async _getCompetitorList () {
      const { code = 0, data = [], msg = '' } = await getCompetitorList({
        projectId: this.projectId
      })
      if (code !== 0) {
        Toast(msg)
        return
      }
      this.competitorList = data.filter(item => !!item)
    },
    async onConfirm () {
      const { code, msg } = await mappingCompetitor({
        projectId: this.projectId,
        competitorIds: this.competitorList.map(item => item.id)
      })
      if (code !== 0) {
        Toast(msg)
      } else {
        Toast('保存成功')
        this.onBack()
      }
      this.isAllowClick = true
    },
    onBack () {
      this.$router.go(-1)
    },
    onAddCompetitor () {
      this.showPop = true
      this.isAllowClick = true
    },
    onUpdateCompetitor (item) {
      this.competitorList = [...this.competitorList, item]
    },
    async onDelCompetitor (item) {
      const { code, msg } = await delMappingCompetitor({
        projectId: this.projectId,
        competitorId: item.id
      })
      if (code !== 0) {
        Toast(msg)
      } else {
        this.competitorList = this.competitorList.filter(competitor => competitor.id !== item.id)
      }
    }
  }
}
</script>

<style scoped lang="less">
.competitor-container {
  margin: .1rem;
  .competitor-list {
    display: flex;
    flex-direction: column;
    .competitor-item {
      height: .4rem;
      background: #ffffff;
      padding-left: .12rem;
      border-bottom: 1px solid #f5f5f5;
      .cardRadios();
      .del-contacts {
        min-width: 100%;
        width: .6rem;
        height: 100%;
        background-color: rgb(238, 10, 36);
        color: @whiteColor;
        font-size: .12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        /deep/ .van-button {
          height: 100%;
        }
      }
      .competitor-name {
        height: .4rem;
        font-size: .14rem;
        color: #333333;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
