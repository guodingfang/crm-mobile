<template>
  <div class="page">
    <Loading v-show="pageLoading" />
    <Form ref="baseForm">
      <Title class="title" title="客户基本信息" />
      <div class="status" v-if="exists">现存</div>
      <div class="content-info">
        <div v-for="item in formInfo" :key="item.id">
          <Item :info="item" @change="onChangeInput" />
        </div>
      </div>

      <ProjectLine :info="productList" :is-allow-click="isAllowAddUser" @select="onSelectLine" />

      <Title class="title" title="联系人信息" />
      <div class="contacts-info" :class="{'contacts-read-only': false}">
        <SwipeCell class="contacts-item" v-for="item in contactsList" :key="item.tag">
          <ContactsItem :info="item" @change="onChangeContacts" />
          <template #right>
            <div class="del-contacts" @click.stop="onDelContacts(item)">
              删除
            </div>
          </template>
        </SwipeCell>
      </div>
      <AddUserBtn v-if="isAllowAddUser" @btn="addContacts" />
    </Form>
    <Footer
      v-if="btnList.length"
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
      @submit="onSubmit"
      @save="onSave"
      @del="onDel"
    />
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import Footer from '@/components/Footer'
import { Form, Item } from '@/components/Form'
import { AddUserBtn } from '@/components/Button'
import { ContactsItem } from '@/components/Contacts'
import ProjectLine from '@/components/ProductLine'
import Title from '@/components/Title'
import form from './mixins/form'
import {
  createCustomer,
  saveCustomer,
  resetCustomer,
  deleteCustomer,
  getCustomerDetails,
  getDetails,
  getCustomerBuProductLine
} from '@/api/customer'
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
import { SwipeCell, Toast, Dialog } from 'vant'
import moment from 'moment'

export default {
  name: 'ClientDetails',
  mixins: [form],
  components: {
    Loading,
    Footer,
    Form,
    Item,
    Title,
    ContactsItem,
    AddUserBtn,
    SwipeCell,
    ProjectLine
  },
  data () {
    return {
      exists: false,
      pageLoading: true,
      btnList: [],
      contactsList: [],
      productList: [],
      isAllowAddUser: true,
      readOnly: false,
      isAllowClick: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    window.scrollTo(0, 0)
    this.getCustomerInfo()
  },
  methods: {
    ...mapActions('customer', ['setRestCustomerList']),

    async getCustomerInfo () {
      const { customerId, cid, exists } = this.$route.query
      this.exists = exists
      if (customerId) {
        const { code = -1, data = {} } = await getCustomerDetails({
          customerId: customerId
        })
        if (code !== 0) return
        this.info = data
        if (this.info.status === 2) {
          this.btnList = [
            { status: 'btn1', name: '提交', type: 'submit' },
            { status: 'btn3', name: '作废', type: 'del' }
          ]
        } else if (this.info.status === 3) {
          this.btnList = [
            { status: 'btn1', name: '提交', type: 'submit' }
            // { status: 'btn2', name: '保存', type: 'save' }
          ]
        }

        this.contactsList = this.info.liaisonList.map(item => ({ ...item, tag: Math.random() })) || []
        this.readOnly = this.info.status === 0 || this.info.status === 1
        this.isAllowAddUser = false
      } else if (cid) {
        const { code = -1, data = {} } = await getDetails(cid)
        if (code !== 0) return
        this.info = { ...data }
        this.btnList = [
          { status: 'btn1', name: '提交', type: 'submit' }
        ]
        this.readOnly = this.exists
      } else {
        this.btnList = [
          { status: 'btn1', name: '提交', type: 'submit' }
          // { status: 'btn2', name: '保存', type: 'save' }
        ]
        this.contactsList = [{
          id: '',
          customerId: '',
          job: '',
          name: '',
          notes: '',
          orgName: '',
          phoneNum: '',
          createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          creater: this.userInfo.name,
          uploadDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          tag: Math.random()
        }]
      }
      await this.getFormInfo(this.info)
      await this.getProductLine()
      this.pageLoading = false
    },

    async getProductLine () {
      const { code, data } = await getCustomerBuProductLine(this.info.customerId || this.info.tycId)
      if (code !== 0) return
      this.productList = data.map(item => ({ ...item, select: !!item.managerCode }))
    },

    onSelectLine (type) {
      this.productList = this.productList.map(item => item.lineType === type ? {
        ...item,
        select: !item.select,
        managerName: !item.select ? this.userInfo.name : '',
        managerCode: !item.select ? this.userInfo.code : '',
        orgName: !item.select ? this.userInfo.dept : ''
      } : item)
    },

    onDelContacts (contacts) {
      if (this.contactsList.length === 1) {
        Toast('最少保留一个联系人')
        return
      }
      this.contactsList = this.contactsList.filter(item => item.tag !== contacts.tag)
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
      if (id === 'province') {
        this.formInfo = this.formInfo.map(item => item.id === 'city'
          ? { ...item, value: '', selectConfigs: { ...item.selectConfigs, notSelect: false } }
          : item)
        this.getCity(value.regionCode)
      }
      this.info = {
        ...this.info,
        [`${id}`]: value[configs.value],
        [`${id}Code`]: value[configs.label]
      }
    },
    addContacts () {
      this.contactsList = [...this.contactsList, {
        id: '',
        customerId: '',
        job: '',
        name: '',
        notes: '',
        orgName: '',
        phoneNum: '',
        createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        creater: this.userInfo.name,
        uploadDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        tag: Math.random()
      }]
    },
    onChangeContacts ({ contacts }) {
      this.contactsList = this.contactsList.map(item => item.tag === contacts.tag ? { ...contacts } : item)
    },
    onSave () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        const params = {
          ...this.info,
          creater: this.userInfo.name,
          liaisonList: this.contactsList.map((item, index) => {
            const { tag, ...args } = item
            return { ...args, mainContact: index === 0 ? 0 : 1 }
          })
        }
        const { code, msg } = await saveCustomer({
          ...params
        })
        if (code === 0) {
          Toast('保存成功')
          this.setRestCustomerList(true)
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
    async onSubmit () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        if (!this.contactsList.length) {
          Toast('最少添加一个联系人')
          this.isAllowClick = true
          return
        }
        const lineType = this.productList.filter(item => item.managerCode === this.userInfo.code && item.select).map(item => ({
          lineType: item.lineType,
          lineTypeName: item.lineTypeName
        }))
        if (!lineType.length) {
          Toast('请选择产品线')
          this.isAllowClick = true
          return
        }
        const params = {
          ...this.info,
          estiblishTime: this.info.estiblishTime ? moment(this.info.estiblishTime).format('YYYY-MM-DD') : '',
          creater: this.userInfo.name,
          areaName: this.info.areaName || this.info.district,
          areaCode: this.info.areaCode || this.info.regionCode,
          address: this.info.address || this.info.rladdress || this.info.taxAddress || this.info.regLocation,
          lineType,
          liaisonList: this.contactsList.map((item, index) => {
            const { tag, ...args } = item
            return { ...args, mainContact: index === 0 ? 0 : 1 }
          })
        }
        // console.log('params', params)
        if (this.info.status === 2) {
          const { code, msg = '' } = await resetCustomer({
            ...params
          })
          if (code === 0) {
            Toast('提交成功')
            this.setRestCustomerList(true)
            this.onBack()
          } else {
            Toast(msg)
          }
        } else {
          const { code, msg } = await createCustomer({
            ...params
          })
          if (code === 0) {
            Toast('提交成功')
            this.setRestCustomerList(true)
            this.onBack()
          } else {
            Toast(msg)
          }
        }
        this.isAllowClick = true
      }).catch(() => {
        Toast('请填写完整')
        this.isAllowClick = true
      })
    },
    onBack () {
      this.$router.go(-1)
    },
    onDel () {
      Dialog.confirm({
        message: '是否要删除？'
      }).then(async () => {
        const { code } = await deleteCustomer({
          customerId: this.info.id
        })
        if (code === 0) {
          Toast('删除成功')
          this.setRestCustomerList(true)
          this.onBack()
          this.isAllowClick = true
        }
      }).catch(() => {
        console.log('取消删除')
        this.isAllowClick = true
      })
    }
  }
}
</script>

<style scoped lang="less">
.page {
  position: relative;
  .status {
    position: absolute;
    top: 0;
    right: 0;
    color: #ffffff;
    background-color: rgb(129, 211, 248);
    font-size: .12rem;
    padding: .03rem .06rem;
    margin: .04rem .12rem;
    border-radius: .04rem;
  }
}
.content-info,
.contacts-info {
  margin: 0 .12rem;
  &.contacts-read-only {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 9;
    }
  }
  .contacts-item {
    margin-bottom: .12rem;
    .cardRadios();
    .del-contacts {
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

.content-info {
  .cardRadios()
}
.title {
  padding-left: .12rem;
}

.footer {
  display: flex;
  align-items: center;
  padding: 0 .12rem;
  justify-content: space-around;
  .btn {
    .btnStyle();
    &.btn-save {
      background: rgb(22, 155, 213);
      color: @whiteColor;
    }
    &.btn-submit {
      background: #1ABC9C;
      color: @whiteColor;
    }
    &.btn-back {
      color: @yellowColor;
      border: 1px solid @yellowColor;
    }
  }
}
</style>
