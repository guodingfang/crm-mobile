<template>
  <div>
    <div class="search-container">
      <Search
        class="search"
        shape="round"
        placeholder="搜索项目名称"
        v-model="searchVal"
        @input="onInputChange"
      />
    </div>

    <PullRefresh
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <List
        v-if="projectList.length"
        class="list-container"
        :finished="finished"
        v-model="loading"
        @load="onLoadProject"
        finished-text="没有更多了"
        offset="100"
        :immediate-check="false"
      >
        <div class="list">
          <Item
            v-for="(item, index) in projectList"
            :key="index"
            :info="item"
            @skip="onSkipProject(item.projectId)"
            @top="onTopProject"
          />
        </div>
      </List>

      <Empty v-else description="暂无项目" />
    </PullRefresh>
  </div>
</template>

<script>
import { Empty, List, PullRefresh, Search, Toast } from 'vant'
import Item from './ProjectItem'
import { getProject, setProWeekReportStar } from '@/api/week'
import { mapActions } from 'vuex'

export default {
  name: 'Content',
  components: {
    Search,
    List,
    PullRefresh,
    Empty,
    Item
  },
  props: {
    contentType: {
      type: String,
      default: 'total'
    }
  },
  data () {
    return {
      finished: false,
      page: 1,
      limit: 10,
      searchVal: '',
      projectTotal: 0,
      projectList: [],
      reloadLoading: false,
      loading: false,
      allowLoad: true
    }
  },
  mounted () {
    this.projectList = Array.apply(null, Array(3))
    this.getProject({ reset: true })
  },
  methods: {
    ...mapActions('week', ['setCurrentProject']),
    async getProject (option = {}) {
      if (!this.allowLoad) return
      this.allowLoad = false
      const { reset = false, ...args } = option
      let params = {
        page: this.page,
        limit: this.limit,
        ...args
      }
      if (this.contentType === 'owner') {
        params = { ...params, type: '1' }
      }
      if (this.contentType === 'sub') {
        params = { ...params, type: '2' }
      }
      const { code = 0, data = null, total, msg = '' } = await getProject({
        ...params
        // type: '0',
        // state: '3',
        // clientNum: this.userInfo.loginNm,
      })
      this.projectTotal = total
      this.finished = this.page * this.limit > total
      this.page = this.page + 1
      if (code === 0) {
        this.projectList = reset ? data : [...this.projectList, ...data]
      } else {
        Toast(msg)
      }
      this.loading = false
      this.allowLoad = true
    },
    onLoadProject () {
      this.getProject()
    },
    async onReload () {
      this.page = 1
      await this.getProject({
        reset: true,
        projectName: this.searchVal
      })
      setTimeout(() => {
        this.reloadLoading = false
      }, 1000)
    },
    onInputChange () {
      this.page = 1
      this.getProject({
        reset: true,
        projectName: this.searchVal
      })
    },
    onSkipProject (projectId) {
      const project = this.projectList.find(item => item.projectId === projectId)
      this.setCurrentProject(project)
      this.$router.push({ name: 'projectTrackList', query: { projectId } })
    },
    async onTopProject (item) {
      const { code, data } = await setProWeekReportStar({
        relationTableId: item.id,
        star: item.star
      })
      if (code !== 0) return
      if (data) {
        this.projectList = this.projectList.map(project => project.projectId === item.id ? {
          ...project,
          star: item.star
        } : project)
        if (item.star === '1') {
          this.starChange()
        } else {
          this.page = 1
          await this.getProject({ reset: true })
        }
      }
    },
    starChange () {
      const starList = []
      const otherList = []
      this.projectList.map(item => {
        if (item.star === '1') {
          starList.push(item)
        } else {
          otherList.push(item)
        }
      })
      this.projectList = [...starList, ...otherList]
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  height: 54px;
  .search {
    width: 100%;
    position: fixed;
    z-index: 999;
    .boxShadow()
  }
}
.list-container {
  min-height: calc(100vh - 1.3rem);
  .list {
    margin: .06rem;
    //.cardRadios()
  }
}
</style>
