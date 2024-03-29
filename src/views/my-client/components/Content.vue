<template>
  <div class="content-container">
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
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <List
        class="list"
        v-if="customerList.length"
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
          @star="onStar"
        />
      </List>
      <Empty v-else description="暂无客户" />
    </PullRefresh>
  </div>
</template>

<script>
import { Search, List, PullRefresh, Empty, Toast } from 'vant'
import Item from '@/views/my-client/components/Item'
import { getCustomerList, setCusStar } from '@/api/customer'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Content',
  components: {
    Search,
    Item,
    List,
    PullRefresh,
    Empty
  },
  props: {
    contentType: {
      type: String,
      default: 'total'
    }
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
    ...mapGetters(['currentCustomer', 'userInfo'])
  },
  mounted () {
    this.customerList = Array.apply(null, Array(3))
    this.getCustomerList({ reset: true })
  },
  activated () {
    if (this.currentCustomer && this.customerList.length) {
      this.customerList = this.customerList.map(item => item && item.id === this.currentCustomer.id
        ? { ...item, ...this.currentCustomer } : item)
      if (this.currentCustomer.star === '1') {
        this.starChange()
      } else {
        this.page = 1
        this.getCustomerList({ reset: true })
      }
    }
    this.setCurrentCustomer(null)
  },
  methods: {
    ...mapActions('customer', ['setCurrentCustomer']),
    async getCustomerList (option = {}) {
      if (!this.allowLoad) return
      this.allowLoad = false

      const { reset = false, ...args } = option
      let params = {
        page: this.page,
        limit: this.limit,
        status: '1',
        ...args
      }
      if (this.contentType === 'owner') {
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
      const { code = -1, data = [], total, msg = '' } = await getCustomerList({
        ...params
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
    },
    async onStar (item) {
      const { code, data } = await setCusStar({
        relationTableId: item.id,
        star: item.star
      })
      if (code !== 0) return
      if (data) {
        this.customerList = this.customerList.map(customer => customer.id === item.id ? {
          ...customer,
          star: item.star
        } : customer)
        if (item.star === '1') {
          this.starChange()
        } else {
          this.page = 1
          this.getCustomerList({ reset: true })
        }
      }
    },
    starChange () {
      const starList = []
      const otherList = []
      this.customerList.map(item => {
        if (item.star === '1' && item.managerList.find(manager => manager.managerCode === this.userInfo.code)) {
          starList.push(item)
        } else {
          otherList.push(item)
        }
      })
      this.customerList = [...starList, ...otherList]
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
.list {
  margin: .06rem;
  //min-height: calc(100vh - 1.62rem);
}
</style>
