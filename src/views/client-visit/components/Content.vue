<template>
  <div>
    <PullRefresh
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <List
        v-if="records.length"
        class="records-list"
        v-model="loading"
        @load="onLoadRecord"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        offset="100"
      >
        <Collapse class="list van-clearfix" v-model="activeNames">
          <CollapseItem :name="record.date" v-for="record in recordsArray" :key="record.date">
            <template #title>
              <div class="item-title">
                <svg-icon name="date" class="date-icon"></svg-icon>
                <h5 class="date-val">{{ record.date }}</h5>
              </div>
            </template>
            <Item
              v-for="item in record.list"
              :key="item.id"
              :info="item"
              @skip="onSkipDetails"
              @del="onDelItem"
            />
          </CollapseItem>
        </Collapse>
      </List>
      <Empty v-else description="暂无打卡记录" />
    </PullRefresh>
  </div>
</template>

<script>
import Item from './Item'
import { Collapse, CollapseItem, List, PullRefresh, Empty, Toast } from 'vant'
import { delClockRecord, queryClockRecord } from '@/api/user'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Content',
  components: {
    List,
    Collapse,
    CollapseItem,
    Item,
    Empty,
    PullRefresh
  },
  props: {
    contentType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      reloadLoading: false,
      activeNames: [],
      loading: false,
      finished: false,
      recordsArray: [],
      records: [],
      page: 1,
      limit: 10,
      allowLoad: true
    }
  },
  computed: {
    ...mapGetters(['updateRecord', 'clockRecordId'])
  },
  watch: {
    records (val) {
      this.recordsArray = val.reduce((total, record) => {
        if (total.find(item => item.date === record.month)) {
          return total.map(item => item.date === record.month ? {
            ...item,
            list: [...item.list, record]
          } : item)
        } else {
          return [
            ...total,
            {
              date: record.month,
              list: [record]
            }
          ]
        }
      }, [])
      this.activeNames = this.recordsArray.map(item => item.date)
    }
  },
  mounted () {
    this.queryClockRecord()
  },
  async activated () {
    // 打卡后更新拜访记录列表
    if (this.updateRecord) {
      this.page = 1
      await this.queryClockRecord({ reset: true })
      this.setUpdateRecord(false)
      return
    }
    if (this.records.length) {
      this.records = this.records.map(item => item.id === this.clockRecordId
        ? { ...item, status: '1' } : item)
    }
    this.setClockRecordId('')
  },
  methods: {
    ...mapActions('visit', ['setCurrentVisit', 'setClockRecordId', 'setUpdateRecord']),
    async queryClockRecord (option = {}) {
      if (!this.allowLoad) return
      this.allowLoad = false
      const { reset = false, ...args } = option
      let params = {
        limit: this.limit,
        page: this.page,
        // descs: 'positionTime',
        ...args
      }
      if (this.contentType === 'total') {
        params = {
          ...params,
          type: '0'
        }
      } else if (this.contentType === 'sub') {
        params = {
          ...params,
          type: '1'
        }
      }
      const { code, data = [], msg = '' } = await queryClockRecord(params)
      if (code !== 0) {
        Toast(msg)
        return
      }
      const { records, current = 1, total } = data
      this.finished = this.page * this.limit > total
      this.page = current + 1
      this.records = reset ? records : [...this.records, ...records]
      this.loading = false
      this.allowLoad = true
    },
    async onLoadRecord () {
      await this.queryClockRecord()
    },
    async onReload () {
      this.page = 1
      await this.queryClockRecord({ reset: true })
      setTimeout(() => {
        this.reloadLoading = false
      }, 1000)
    },
    onSkipDetails ({ info }) {
      this.setCurrentVisit(info)
      this.$router.push({ name: 'visitDetails' })
    },
    async onDelItem ({ info }) {
      const { code, msg = '' } = await delClockRecord(info.id)
      if (code !== 0) {
        Toast(msg)
      } else {
        this.records = this.records.filter(item => item.id !== info.id)
        Toast('删除成功')
      }
    }
  }
}
</script>

<style scoped lang="less">
.records-list {
  padding-top: .12rem;
  min-height: calc(100vh - .85rem);
  box-sizing: border-box;
  .date-icon {
    color: @linkColor;
  }
  .list {
    /deep/ .van-collapse-item__content {
      padding: 0;
      background-color: transparent;
      .item {
        padding: .06rem .12rem;
      }
    }
  }
}
.item-title {
  display: flex;
  align-items: center;
}
</style>
