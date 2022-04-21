<template>
  <div>
    <div class="search-container">
      <Search
        class="search"
        v-model="searchVal"
        shape="round"
        placeholder="搜索客户名称"
        @input="onInputChange"
      />
    </div>
    <PullRefresh
      v-if="customerList.length"
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <Title class="title" :title="`当前有负责${customerTotal || 0}个客户`" :is-prefix="false"/>
      <List
        class="list"
        v-model="loading"
        @load="onLoadCustomer"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        offset="100"
      >
        <Item
          v-for="(item, index) in customerList"
          :key="index"
          :info="item"
          @skip="onSkipDetails"
        />
      </List>
    </PullRefresh>
    <Empty v-else description="暂无客户" />
  </div>
</template>

<script>
import { Search, List, PullRefresh, Empty, Toast } from 'vant'
import Title from '@/components/Title'
import Item from './components/Item'
import { getCustomerList } from '@/api/customer'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MyClientList',
  components: {
    Search,
    Title,
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
      searchVal: '',
      customerList: [],
      page: 1,
      limit: 10,
      customerTotal: 0,
      allowLoad: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentCustomer'])
  },
  mounted () {
    this.customerList = Array.apply(null, Array(3))
    this.getCustomerList({ reset: true })
  },
  activated () {
    if (this.currentCustomer && this.customerList.length) {
      console.log('currentCustomer', this.currentCustomer)
      this.customerList = this.customerList.map(item => item && item.id === this.currentCustomer.id
        ? { ...item, ...this.currentCustomer } : item)
    }
    this.setCurrentCustomer(null)
  },
  methods: {
    ...mapActions('customer', ['setCurrentCustomer']),

    // 获取客户列表
    async getCustomerList (option = {}) {
      if (!this.allowLoad) return
      this.allowLoad = false

      const { reset = false, ...args } = option
      const { code = -1, data = [], total, msg = '' } = await getCustomerList({
        page: this.page,
        limit: this.limit,
        status: '1',
        ...args
      })
      this.customerTotal = total
      this.finished = this.page * this.limit > total
      this.page = this.page + 1
      if (code === 0) {
        this.customerList = reset ? data : [...this.customerList, ...data]
      } else {
        Toast(msg)
      }
      this.allowLoad = true
      this.loading = false
    },
    onInputChange () {
      this.page = 1
      this.getCustomerList({
        customerName: this.searchVal,
        reset: true
      })
    },
    onLoadCustomer () {
      this.getCustomerList()
    },
    async onReload () {
      this.page = 1
      await this.getCustomerList({
        customerName: this.searchVal,
        reset: true
      })
      setTimeout(() => {
        this.reloadLoading = false
      }, 1000)
    },
    onSkipDetails ({ customerId }) {
      this.$router.push({ name: 'myClientDetails', query: { customerId } })
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  height: .54rem;
  .search {
    width: 100%;
    position: fixed;
    z-index: 999;
    .boxShadow()
  }
}
.title {
  margin-left: .12rem;
}
.customer-total {
  margin-left: .12rem;
  font-size: .14rem;
  height: .24rem;
  display: flex;
  align-items: center;
  color: @textColor;
}
.list {
  margin: 0 .06rem;
}
</style>
