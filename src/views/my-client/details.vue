<template>
  <div>
    <Loading v-show="pageLoading" />
    <Form ref="baseForm">
      <Title class="title" title="客户基本信息">
        <template #right v-if="showSaveBtn">
        <div class="title-btn" @click="onConfirm">保存</div>
        </template>
      </Title>
      <div class="content-info">
        <div v-for="(item, index) in formInfo" :key="index">
          <Item :info="item" @change="onChangeInput" />
        </div>
      </div>

      <Title class="title" title="联系人信息" />
      <div class="contacts-info">
        <ContactsItemModel
          v-for="item in contactsList"
          :info="item"
          :key="item.id"
          @edit="onEditContacts"
        />
      </div>

      <AddUserBtn @btn="addContacts" />
    </Form>

    <Footer
      :btn-list="btnList"
      @confirm="onConfirm"
      @look="onLook"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import Loading from '@/components/Loading'
import { Form, Item } from '@/components/Form'
import Footer from '@/components/Footer'
import { getCustomerList, updateCustomer } from '@/api/customer'
import { ContactsItemModel } from '@/components/Contacts'
import form from './mixins/form'
import { mapActions, mapGetters } from 'vuex'
import { AddUserBtn } from '@/components/Button'
import { Toast } from 'vant'
export default {
  name: 'MyClientDetails',
  mixins: [form],
  components: {
    Loading,
    Title,
    Footer,
    Form,
    Item,
    ContactsItemModel,
    AddUserBtn
  },
  data () {
    return {
      pageLoading: true,
      showSaveBtn: false,
      btnList: [
        { status: 'btn2', name: '查看拜访', type: 'look' }
      ],
      info: null,
      contactsList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'contactsInfo'])
  },
  mounted () {
    this.customerId = this.$route.query.customerId
    this.getCustomerInfo()
  },
  methods: {
    ...mapActions('customer', ['setCurrentCustomer', 'setContactsInfo']),

    async getCustomerInfo () {
      const { code = -1, data = [], msg = '' } = await getCustomerList({
        id: this.customerId
      })
      if (code !== 0) {
        Toast(msg)
        return
      }
      this.info = data.length ? data[0] : {}
      this.contactsList = this.info.liaisonList.map(item => ({ ...item, tag: Math.random() })) || []
      await this.getFormInfo(this.info)
      this.pageLoading = false
      this.setCurrentCustomer({
        ...this.getParams()
      })
    },

    onChangeInput ({ type, id, configs, value }) {
      this.showSaveBtn = true
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
        this.formInfo = this.formInfo.map(item => item.id === 'city' ? { ...item, value: '' } : item)
        this.getCity(value.regionCode)
      }
      this.info = {
        ...this.info,
        [`${id}`]: value[configs.value],
        [`${id}Code`]: value[configs.label]
      }
    },
    onChangeContacts ({ contacts }) {
      this.contactsList = this.contactsList.map(item => item.tag === contacts.tag ? { ...contacts } : item)
    },
    onEditContacts (info) {
      this.setContactsInfo(info)
      this.$router.push({ name: 'addContacts', query: { type: 'edit' } })
    },
    addContacts () {
      this.setContactsInfo({ customerId: this.info.id })
      this.$router.push({ name: 'addContacts', query: { type: 'add' } })
    },
    async onConfirm () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        const { code } = await updateCustomer({
          ...this.getParams()
        })
        if (code === 0) {
          Toast('修改成功')
          this.setCurrentCustomer({
            ...this.getParams()
          })
          this.onBack()
        }
      }).catch(() => {
        Toast('请填写完整')
      })
    },
    onLook () {
      this.setCurrentCustomer({
        ...this.getParams()
      })
      this.$router.push({ name: 'myClientVisitRecord' })
    },
    onBack () {
      this.$router.go(-1)
    },
    getParams () {
      return {
        ...this.info,
        liaisonList: this.contactsList.map(item => {
          const { tag, ...args } = item
          return { ...args }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.content-info,
.contacts-info {
  margin: 0 .12rem;
  .cardRadios()
}
.title {
  padding: 0 .12rem;
  .title-btn {
    margin-left: auto;
    color: @whiteColor;
    font-size: .12rem;
    border-radius: .06rem;
    padding: .03rem .06rem;
    background-color: rgb(25, 158, 216);
  }
}
.column {
  flex-direction: column;
}
</style>
