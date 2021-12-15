<template>
  <div>
    <div class="search-container">
      <Search
        class="search"
        shape="round"
        placeholder=" 搜索项目编号或名称"
        @input="onInputChange"
      />
    </div>

    <PullRefresh
      v-if="projectList.length"
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <Title class="title" :title="`当前共计X条跟进中的项目`" :is-prefix="false"/>
      <List
        class="list-container"
        :finished="finished"
        finished-text="没有更多了"
      >
        <div class="list">
          <Item @skip="onSkipProject" />
        </div>
      </List>

    </PullRefresh>

    <Empty v-else />
  </div>
</template>

<script>
import { Search, List, PullRefresh, Empty } from 'vant'
import Title from '@/components/Title'
import Item from './components/ProjectItem'
export default {
  name: 'ProjectTrack',
  components: {
    Search,
    Title,
    List,
    PullRefresh,
    Empty,
    Item
  },
  data () {
    return {
      reloadLoading: false,
      loading: false,
      finished: false,
      projectList: [1]
    }
  },
  methods: {
    onReload () {
      setTimeout(() => {
        this.reloadLoading = false
      }, 1000)
    },
    onInputChange (e) {
      console.log('e', e)
    },
    onSkipProject (e) {
      this.$router.push({ name: 'projectTrackList' })
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
.title {
  margin: 0 .12rem;
}
.list-container {
  min-height: calc(100vh - 1rem);
  .list {
    margin: 0 .12rem;
    .cardRadios()
  }
}
</style>
