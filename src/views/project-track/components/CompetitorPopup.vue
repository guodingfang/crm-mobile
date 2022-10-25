<template>
  <div>
    <Popup
      v-model="showCompetitor"
      position="right"
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="search-container">
        <Search
          class="search"
          shape="round"
          placeholder="搜索竞争对手"
          v-model="searchVal"
          @input="onInputChange"
        />
      </div>
      <div class="competitor-container">
        <ul class="competitor-list">
          <li class="competitor-item" v-for="competitor in competitorList" :key="competitor.id">
            <div class="competitor-name">{{ competitor.competitorName }}</div>
            <div class="status" v-if="isSelectCompetitor(competitor)">已添加</div>
            <div class="btn" v-else @click="onAddCompetitor(competitor)">添加</div>
          </li>
        </ul>
      </div>
    </Popup>
  </div>
</template>

<script>
import { Popup, Search, Toast } from 'vant'
import { getSearchCompetitorList } from '@/api/competitor'
export default {
  name: 'CompetitorPop',
  components: {
    Popup,
    Search
  },
  props: {
    showPop: {
      type: Boolean,
      default: false
    },
    selectCompetitorList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchVal: '',
      competitorList: []
    }
  },
  mounted () {
    this.onInputChange()
  },
  computed: {
    showCompetitor: {
      get () {
        return this.showPop
      },
      set (value) {
        this.$emit('update:showPop', false)
      }
    },
    isSelectCompetitor () {
      return (item) => !!this.selectCompetitorList.find(competitor => competitor.id === item.id)
    }
  },
  methods: {
    onInputChange () {
      this.searchCompetitorList()
    },
    async searchCompetitorList () {
      const { code, data = [], msg } = await getSearchCompetitorList({
        name: this.searchVal
      })
      if (code !== 0) {
        Toast(msg)
      } else {
        this.competitorList = data.filter(item => !!item)
      }
    },
    onAddCompetitor (competitor) {
      this.$emit('updateCompetitor', { ...competitor })
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f5f5f5;
      .competitor-name {
        font-size: .14rem;
        color: #333333;
      }
      .status {
        font-size: .12rem;
        color: #999999;
      }
      .btn {
        border-radius: .04rem;
        background-color: rgba(25, 158, 216);
        color: #ffffff;
        font-size: .12rem;
        padding: .04rem .068rem;
      }
    }
  }
}
</style>
