<template>
  <div>
    <div>
      <PullRefresh
        v-if="records.length"
        v-model="reloadLoading"
        @refresh="onReload"
      >
        <div class="header">
          <div class="customer-name">{{ customerName }}</div>
          <div class="record-total">共{{ customerTotal }}条</div>
        </div>
        <List
          class="records-list"
          v-model="loading"
          @load="onLoadRecord"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          offset="100"
        >
          <Collapse v-model="activeNames">
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
              />
            </CollapseItem>
          </Collapse>
        </List>
      </PullRefresh>
      <Empty v-else description="暂无拜访记录" />
    </div>
    <Footer
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
      @add="onAdd"
      @back="onBack"
    />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import { Collapse, CollapseItem, List, PullRefresh, Empty } from 'vant'
import Item from './components/RecordItem'
import { queryCustomerVisitManage } from '@/api/visit'
import { mapGetters } from 'vuex'
export default {
  name: 'visitList',
  components: {
    Footer,
    Collapse,
    CollapseItem,
    Item,
    List,
    PullRefresh,
    Empty
  },
  data () {
    return {
      reloadLoading: false,
      loading: false,
      finished: false,
      activeNames: [],
      btnList: [
        { status: 'btn1', name: '新建拜访', type: 'add' }
      ],
      recordsArray: [],
      records: [],
      page: 1,
      limit: 10,
      customerTotal: 0,
      customerName: '',
      allowLoad: true,
      isAllowClick: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentCustomer'])
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
    this.customerName = this.currentCustomer.customerName
    this.customerId = this.currentCustomer.id
    this.queryCustomerVisitManage()
  },
  methods: {
    async queryCustomerVisitManage (option = {}) {
      if (!this.allowLoad) return
      this.allowLoad = false
      const { reset = false, ...args } = option
      const { code, data } = await queryCustomerVisitManage({
        customerId: this.customerId,
        limit: this.limit,
        page: this.page,
        ...args
      })
      if (code !== 0) return
      const { records, total } = data
      this.finished = this.page * this.limit > total
      this.customerTotal = total
      this.page = this.page + 1
      this.records = reset ? records : [...this.records, ...records]
      this.loading = false
      this.allowLoad = true
    },
    async onLoadRecord () {
      await this.queryCustomerVisitManage()
    },
    async onReload () {
      this.page = 1
      await this.queryCustomerVisitManage({ reset: true })
      setTimeout(() => {
        this.reloadLoading = false
      }, 1000)
    },
    onSkipDetails () {
      console.log('@')
    },
    onAdd () {
      this.$router.push({ name: 'clientVisit' })
      this.isAllowClick = true
    },
    onBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.header {
  display: flex;
  font-size: .14rem;
  align-items: center;
  padding: .08rem .12rem;
  box-sizing: border-box;
  color: @textColor;
  .record-total {
    font-size: .12rem;
    margin-left: auto;
  }
}
.item-title {
  display: flex;
  align-items: center;
}
.records-list {
  min-height: calc(100vh - 1.3rem);
  .date-icon {
    color: @linkColor;
  }
  /deep/ .van-collapse-item__content {
    padding: 0;
    background-color: transparent;
    .item {
      padding: .06rem .12rem;
    }
  }
}
</style>
