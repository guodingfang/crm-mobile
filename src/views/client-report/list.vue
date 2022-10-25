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
      v-model="reloadLoading"
      @refresh="onReload"
    >
      <Title class="title" :title="`当前共${customerTotal || 0}条报备客户`" :is-prefix="false" />
      <List
        v-if="customerList.length"
        class="records-list"
        v-model="loading"
        @load="onLoadCustomer"
        :finished="finished"
        finished-text="没有更多了"
        offset="100"
        :immediate-check="false"
      >
        <div v-for="(item, index) in customerList" :key="index" class="records-item">
          <SwipeCell v-if="item && item.status === 3">
            <Item
              :info="item"
              @skip="onSkipDetails"
            />
            <template #right>
              <div class="del-records" @click.stop="onDelRecords(item)">
                删除
              </div>
            </template>
          </SwipeCell>
          <Item
            :key="index"
            v-else
            :info="item"
            @skip="onSkipDetails"
          />
        </div>
      </List>
      <Empty v-else description="暂无客户记录" />
    </PullRefresh>
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
import { Search, List, PullRefresh, Empty, SwipeCell, Toast } from 'vant'
import Item from './components/Item'
import Title from '@/components/Title'
import { getCustomerList, removeCustomer } from '@/api/customer'
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
    Empty,
    SwipeCell
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
        { status: 'btn1', name: '新建报备', type: 'add' }
      ],
      allowLoad: true,
      isAllowClick: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'restCustomerList'])
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
        managerName: this.userInfo.name,
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
      this.$router.push({ name: 'clientReportDetails', query: { customerId, exists: true } })
    },
    async onDelRecords (item) {
      const { code } = await removeCustomer({
        customerId: item.id
      })
      if (code === 0) {
        this.customerList = this.customerList.filter(customer => customer.id !== item.id)
      }
    },
    onAdd () {
      this.$router.push({ name: 'clientCompany' })
      this.isAllowClick = true
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
  .records-item {
    margin: 0 .06rem .06rem .06rem;
    border-radius: .06rem;
    overflow: hidden;
    .del-records {
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
  }
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
