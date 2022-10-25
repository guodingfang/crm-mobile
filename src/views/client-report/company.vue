<template>
  <div>
    <div class="search-container">
      <Search
        class="search"
        v-model="searchVal"
        shape="round"
        placeholder="请输入6个字以上客户名称"
        @input="onInputChange"
      >
<!--        <template #action>-->
<!--          <div class="search-btn" :class="{ 'not-search-btn': !isSearch }" @click="onSearch">查 询</div>-->
<!--        </template>-->
      </Search>
    </div>
    <div class="company-list">
      <CompanyItem v-for="company in companyList" :info="company" :key="company.id" />
    </div>
  </div>
</template>

<script>
import { Search } from 'vant'
import CompanyItem from './components/CompanyItem'
import { searchCustomer } from '@/api/customer'
export default {
  name: 'company',
  components: {
    Search,
    CompanyItem
  },
  data () {
    return {
      searchVal: '',
      // isSearch: false,
      companyList: []
    }
  },
  methods: {
    onInputChange () {
      if (this.searchVal.length >= 6) {
        this.onSearch()
      } else {
        this.companyList = []
      }
      // this.isSearch = this.searchVal && this.searchVal.length >= 6
    },
    async onSearch () {
      // if (!this.isSearch) return
      const { code, data } = await searchCustomer(this.searchVal)
      if (code !== 0) return
      this.companyList = data.filter(item => item.id)
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  /deep/ .van-search__action {
    &:hover {
      background-color: transparent !important;
    }
    .search-btn {
      background: rgb(22, 155, 213);
      color: #ffffff;
      padding: 0 .16rem;
      height: .34rem;
      border-radius: .34rem;
      font-size: .12rem;
      &.not-search-btn {
        background: rgb(215, 215, 215);
        color: #ffffff;
      }
    }
  }
}
</style>
