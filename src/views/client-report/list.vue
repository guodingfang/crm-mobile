<template>
  <div>
    <div class="search-container">
      <Search
        class="search"
        v-model="searchVal"
        shape="round"
        placeholder="搜索报备客户名称"
        @input="onInputChange"
      />
    </div>
    <PullRefresh
      v-if="customerList.length"
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <Title class="title" :title="`当前${customerTotal || 0}条报备客户`" :is-prefix="false" />
      <List
        class="records-list"
        v-model="loading"
        @load="onLoadCustomer"
        :finished="finished"
        finished-text="没有更多了"
        offset="100"
        :immediate-check="false"
      >
        <Item
          v-for="(item, index) in customerList"
          :key="index"
          :info="item"
          @skip="onSkipDetails"
        />
      </List>
    </PullRefresh>
    <Empty v-else description="暂无客户记录" />
    <Footer
      :btn-list="btnList"
      @add="onAdd"
      @back="onBack"
    />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import { Search, List, PullRefresh, Empty, Toast } from 'vant'
import Item from './components/Item'
import Title from '@/components/Title'
import { getCustomerList } from '@/api/customer'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ReportList',
  components: {
    Footer,
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
      btnList: [
        { status: 'btn1', name: '新建', type: 'add' }
      ],
      allowLoad: true
    }
  },
  computed: {
    ...mapGetters(['restCustomerList'])
  },
  activated () {
    if (this.restCustomerList) {
      this.page = 1
      this.getCustomerList({
        reset: true
      })
    }
    this.setRestCustomerList(false)
  },
  mounted () {
    this.customerList = Array.apply(null, Array(3))
    this.getCustomerList({ reset: true })
  },
  methods: {
    ...mapActions('customer', ['setRestCustomerList']),

    async getCustomerList (option = {}) {
      if (!this.allowLoad) return
      this.allowLoad = false
      const { reset = false, ...args } = option
      const { code = 0, data = null, total, msg = '' } = await getCustomerList({
        page: this.page,
        limit: this.limit,
        status: '0,2,3',
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
      this.loading = false
      this.allowLoad = true
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
      this.$router.push({ name: 'clientReportDetails', query: { customerId } })
    },
    onAdd () {
      this.$router.push({ name: 'clientReportDetails' })
    },
    onBack () {
      this.$router.go(-1)
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
  margin-left: .12rem;
}
.records-list {
  min-height: calc(100vh - 1.9rem);
}
.footer {
  display: flex;
  align-items: center;
  padding: 0 .12rem;
  justify-content: space-around;
  .btn {
    .btnStyle();
    &.btn-add {
      background: rgb(22, 155, 213);
      color: @whiteColor;
    }
    &.btn-back {
      color: @yellowColor;
      border: 1px solid @yellowColor;
    }
  }
}
</style>
