<template>
  <div class="container">
    <Title class="title" title="每周进展列表" />
    <div class="list" v-if="weekList.length">
      <Item
        v-for="(item, index) in weekList"
        :key="index"
        :info="item"
        @skip="onSkipWeekDetails(item)"
      />
    </div>
    <Empty v-else description="暂无每周进展" />
    <Footer
      :class="{'footer-btn': !isApplyWeek}"
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import Item from './components/TrackItem'
import Footer from '@/components/Footer'
import { getProjectWeekList, hasWeekly } from '@/api/week'
import { Toast, Empty } from 'vant'
export default {
  name: 'trackList',
  components: {
    Title,
    Item,
    Footer,
    Empty
  },
  data () {
    return {
      isApplyWeek: false,
      projectId: '',
      weekList: [],
      btnList: [
        { status: 'btn1', name: '创建跟踪', type: 'confirm' }
      ],
      isAllowClick: true
    }
  },
  mounted () {
    this.projectId = this.$route.query.projectId
    this.getProjectWeekList()
    this.getHasWeekly()
  },
  methods: {
    async getProjectWeekList () {
      const { code, data, msg } = await getProjectWeekList({
        projectId: this.projectId,
        page: 1,
        limit: 10000
      })
      if (code === 0) {
        this.weekList = data
      } else {
        Toast(msg)
      }
    },
    async getHasWeekly () {
      const { code, data, msg } = await hasWeekly({
        projectId: this.projectId
      })
      if (code === 0) {
        this.isApplyWeek = data
      } else {
        Toast(msg)
      }
    },
    onSkipWeekDetails (item) {
      const { id } = item
      this.$router.push({ name: 'projectTrackDetails', query: { id, projectId: this.projectId } })
    },
    onConfirm () {
      if (this.isApplyWeek) {
        this.$router.push({ name: 'projectTrackDetails', query: { projectId: this.projectId } })
      }
      this.isAllowClick = true
    }
  }
}
</script>

<style scoped lang="less">
.title {
  padding: 0 .12rem;
}
.list {
  //padding: 0 .12rem;
}
.footer-btn {
  /deep/ .btn1 {
    background-color: #ccc !important;
  }
}
</style>
