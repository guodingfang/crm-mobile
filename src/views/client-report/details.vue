<template>
  <div>
    <Loading v-show="pageLoading" />
    <Form ref="baseForm">
      <Title class="title" title="客户基本信息" />
      <div class="content-info">
        <div v-for="item in formInfo" :key="item.id">
          <Item :info="item" @change="onChangeInput" />
        </div>
      </div>

      <Title class="title" title="联系人信息" />
      <div class="contacts-info">
        <ContactsItem
          v-for="item in contactsList"
          :info="item"
          :key="item.tag"
          @change="onChangeContacts"
        />
      </div>

      <AddUserBtn v-if="!readOnly" @btn="addContacts" />
    </Form>
    <Footer
      v-if="btnList.length"
      :btn-list="btnList"
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
import Title from '@/components/Title'
import form from './mixins/form'
import { getCustomerList, createCustomer, resetCustomer, deleteCustomer } from '@/api/customer'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { Toast, Dialog } from 'vant'

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
    AddUserBtn
  },
  data () {
    return {
      pageLoading: true,
      btnList: [],
      contactsList: [],
      readOnly: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    const { customerId } = this.$route.query
    this.getCustomerInfo(customerId)
  },
  methods: {
    ...mapActions('customer', ['setRestCustomerList']),

    async getCustomerInfo (customerId) {
      if (customerId) {
        const { code = -1, data = [] } = await getCustomerList({
          id: customerId
        })
        if (code !== 0) return
        this.info = data.length ? data[0] : {}
        if (this.info.status === 2) {
          this.btnList = [
            { status: 'btn1', name: '提交', type: 'submit' },
            { status: 'btn3', name: '删除', type: 'del' }
          ]
        }

        this.contactsList = this.info.liaisonList.map(item => ({ ...item, tag: Math.random() })) || []
        this.readOnly = this.info.status === 0 || this.info.status === 1
      } else {
        this.btnList = [
          { status: 'btn1', name: '提交', type: 'submit' },
          { status: 'btn2', name: '保存', type: 'save' }
        ]
        this.contactsList = [{
          id: '',
          customerId: '',
          job: '',
          name: '',
          notes: '',
          orgName: '',
          phoneNum: '',
          createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          creater: this.userInfo.name,
          uploadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          tag: Math.random()
        }]
      }
      await this.getFormInfo(this.info)
      this.pageLoading = false
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
        mainContact: this.contactsList.length ? 1 : 0,
        createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        creater: this.userInfo.name,
        uploadDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        tag: Math.random()
      }]
    },
    onChangeContacts ({ contacts }) {
      this.contactsList = this.contactsList.map(item => item.tag === contacts.tag ? { ...contacts } : item)
    },
    onSave () {
      console.log('save')
    },
    async onSubmit () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        const params = {
          ...this.info,
          liaisonList: this.contactsList.map(item => {
            const { tag, ...args } = item
            return { ...args }
          })
        }
        if (this.info.status === 2) {
          const { code } = await resetCustomer({
            ...params
          })
          if (code === 0) {
            this.setRestCustomerList(true)
            this.onBack()
          }
        } else {
          const { code } = await createCustomer({
            ...params
          })
          if (code === 0) {
            this.setRestCustomerList(true)
            this.onBack()
          }
        }
      }).catch(() => {
        Toast('请填写完整')
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
        }
      }).catch(() => {
        console.log('取消删除')
      })
    }
  }
}
</script>

<style scoped lang="less">
.content-info,
.contacts-info {
  margin: 0 .12rem;
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
