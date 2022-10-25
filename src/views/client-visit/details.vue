<template>
  <div>
    <Loading v-show="pageLoading" />

    <Form ref="formBase">
      <Title class="title" title="拜访信息填写"></Title>
      <div class="content-list">
        <div v-for="(item, index) in formInfo" :key="index">
          <Item :info="item" @change="onChangeInput" @pickerChange="onPickerChange">
            <template #slotTop>
              <Search
                class="search"
                v-model="searchVal"
                shape="round"
                placeholder="搜索客户名称"
                @input="onInputChange"
              />
            </template>
            <template #slotBottom>
              <div class="btn-more" @click="onMore">
                {{ btnText }}
              </div>
            </template>
            <template #slotUserBottom>
              <div class="btn-addUser" @click="onAddUser">
                <Icon name="add-o" />
                添加联系人
              </div>
            </template>
            <template #slotOption="{item}">
              <div>{{ item.name }}</div>
              <div class="select-user-btn" :class="{'selected-btn': item.select}" @click="onSelectUser(item)">
                <Icon name="success" />
              </div>
            </template>
          </Item>
        </div>
      </div>
    </Form>
    <Footer
      v-if="btnList.length"
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
      @confirm="onConfirm"
      @back="onBack"
    />
    <AddUserPop
      :showPop.sync="showUser"
      :customerId="info.customerId"
      @changeContacts="onChangeContacts"
    />
  </div>

</template>

<script>
import Loading from '@/components/Loading'
import Footer from '@/components/Footer'
import Title from '@/components/Title'
import AddUserPop from './components/addUserPop'
import { Form, Item } from '@/components/Form'
import { addVisitRecord, queryCustomerVisitDetails } from '@/api/visit'
import { mapGetters, mapActions } from 'vuex'
import form from './mixins/form'
import { Search, Icon, Toast } from 'vant'
import dayjs from 'dayjs'

export default {
  name: 'ClientVisit',
  mixins: [form],
  components: {
    Loading,
    Footer,
    Title,
    Form,
    Item,
    Search,
    Icon,
    AddUserPop
  },
  data () {
    return {
      pageLoading: true,
      btnList: [
        { status: 'btn1', name: '确定', type: 'confirm' }
      ],
      status: '0',
      info: {},
      positionId: '',
      searchVal: '',
      page: 1,
      limit: 10,
      complete: false,
      btnText: '点击加载更多',
      showUser: false,
      isAllowClick: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentVisit'])
  },
  mounted () {
    this.queryCustomerVisitDetails()
  },
  beforeRouteEnter (to, from, next) {
    // window.scrollTo(0, 0)
    next()
  },
  methods: {
    ...mapActions('visit', ['setClockRecordId']),

    onInputChange () {
      this.formInfo = this.formInfo.map(item => item.id === 'customerName' ? {
        ...item,
        selectConfigs: {
          ...item.selectConfigs,
          defaultIndex: 0
        }
      } : item)
      this.page = 1
      this.getCustomerList({
        reset: true,
        customerName: this.searchVal
      })
    },

    async onMore () {
      this.page += 1
      if (this.complete) return
      await this.getCustomerList({
        customerName: this.searchVal
      })
      if (this.complete) {
        this.btnText = '已全部加载'
      }
    },

    onSelectUser (item) {
      this.formInfo = this.formInfo.map(info => {
        if (info.id === 'liaisonName') {
          const columns = info.columns.map(col => col.id === item.id ? { ...col, select: !col.select } : col)
          return {
            ...info,
            value: columns.filter(item => item.select).map(item => item.name).join(','),
            columns
          }
        } else {
          return info
        }
      })
    },

    onAddUser () {
      this.showUser = true
    },

    onChangeContacts () {
      this.changeContactsList()
    },

    async queryCustomerVisitDetails () {
      const { code, data } = await queryCustomerVisitDetails(this.currentVisit.id)
      if (code !== 0) return
      this.info = data || {}
      await this.getFormInfo(this.info)
      this.pageLoading = false
    },
    onPickerChange ({ id, value, index }) {
      this.formInfo = this.formInfo.map(item => item.id === id ? {
        ...item,
        selectConfigs: {
          ...item.selectConfigs,
          defaultIndex: index
        }
      } : item)
    },
    onChangeInput ({ type, id, configs, value }) {
      if (type === 'input') {
        this.formInfo = this.formInfo.map(item => item.id === id ? {
          ...item,
          value: value
        } : item)
        this.info = {
          ...this.info,
          [`${id}`]: value
        }
        return
      }

      this.formInfo = this.formInfo.map(item => item.id === id ? {
        ...item,
        value: value[configs.value]
      } : item)
      if (id === 'customerName') {
        this.defaultType(value)
        this.getContactsList(value.id)
        this.info = {
          ...this.info,
          customerName: value[configs.value],
          customerId: value[configs.label]
        }
      }
      if (id === 'visitType') {
        this.info = {
          ...this.info,
          visitType: value[configs.label],
          visitTypeName: value[configs.value]
        }
      }
    },
    async onConfirm () {
      let params = {
        ...this.info,
        liaisonList: this.formInfo.find(item => item.id === 'liaisonName').columns
          .filter(item => item.select)
          .map(item => ({ id: item.id, name: item.name })),
        positionId: this.currentVisit.id
      }
      if (this.status === '0') {
        params = {
          ...params,
          createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          creater: this.userInfo.name
        }
      }
      if (this.status === '1') {
        params = {
          ...params,
          updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.$refs.formBase.$refs.useForm.validate().then(async () => {
        const { code, msg = '' } = await addVisitRecord({
          ...params
        })
        if (code === 0) {
          Toast('保存完成')
          this.setClockRecordId(this.currentVisit.id)
          this.onBack()
        } else {
          Toast(msg)
        }
        this.isAllowClick = true
      }).catch(() => {
        Toast('请填写完整')
        this.isAllowClick = true
      })
    },
    onBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.title {
  margin: 0 .12rem;
}
.content-list {
  margin: 0 .12rem;
  .cardRadios()
}
.btn-more, .btn-addUser {
  display: flex;
  align-items: center;
  justify-content: center;
  height: .5rem;
  color: #999999;
  font-size: .12rem;
  /deep/ .van-icon {
    margin-right: .06rem;
  }
}
.select-user-btn {
  margin-left: .12rem;
  width: .16rem;
  height: .16rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .14rem;
  color: #ffffff;
  background-color: #d5d5d5;
  &.selected-btn {
    background-color: #02a7f0;
  }
}
</style>
