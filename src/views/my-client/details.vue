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
        <div class="star-btn" v-if="info && isManagerUser" @click="onStar">
          <Icon name="star" v-if="info.star === '1'" />
          <Icon name="star-o" v-else />
        </div>
        <div v-for="(item, index) in formInfo" :key="index">
          <Item :info="item" @change="onChangeInput" />
        </div>
      </div>

      <ProjectLine :is-show-select="false" :info="productList" :is-allow-click="false" />

      <Title class="title" title="联系人信息" />
      <div class="contacts-info">
        <SwipeCell
          class="contacts-item"
          v-for="item in contactsList"
          :key="item.tag"
          :disabled="item.mainContact === 0"
        >
          <ContactsItemModel :info="item" @edit="onEditContacts"/>
          <template #right>
            <div class="del-contacts" @click.stop="onDelContacts(item)">
              删除
            </div>
          </template>
        </SwipeCell>
      </div>

      <AddUserBtn v-if="!readOnly" @btn="addContacts" />
    </Form>

    <Footer
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
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
import { getCustomerDetails, updateCustomer, setCusStar, getCustomerBuProductLine } from '@/api/customer'
import { ContactsItemModel } from '@/components/Contacts'
import form from './mixins/form'
import { mapActions, mapGetters } from 'vuex'
import { AddUserBtn } from '@/components/Button'
import ProjectLine from '@/components/ProductLine'
import { SwipeCell, Icon, Toast } from 'vant'
export default {
  name: 'MyClientDetails',
  mixins: [form],
  components: {
    SwipeCell,
    Loading,
    Title,
    Footer,
    Form,
    Item,
    ContactsItemModel,
    AddUserBtn,
    Icon,
    ProjectLine
  },
  data () {
    return {
      pageLoading: true,
      showSaveBtn: false,
      btnList: [
        { status: 'btn2', name: '查看拜访', type: 'look' }
      ],
      info: null,
      contactsList: [],
      productList: [],
      readOnly: false,
      isAllowClick: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'contactsInfo']),
    isManagerUser () {
      if (!this.info) return ''
      return this.info.managerList.find(item => item.managerCode === this.userInfo.code)
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.customerId = this.$route.query.customerId
    this.getCustomerInfo()
  },
  methods: {
    ...mapActions('customer', ['setCurrentCustomer', 'setContactsInfo']),

    async getCustomerInfo () {
      const { code = -1, data = {}, msg = '' } = await getCustomerDetails({
        customerId: this.customerId
      })
      if (code !== 0) {
        Toast(msg)
        return
      }
      this.info = data
      this.contactsList = this.info.liaisonList
        ? this.info.liaisonList.map(item => ({ ...item, tag: Math.random() })) || []
        : []

      // this.readOnly = this.info.managerList.find(manager => manager.owner === 0 && manager.managerCode !== this.userInfo.code)

      await this.getFormInfo(this.info)
      await this.getProductLine()
      this.pageLoading = false
      this.setCurrentCustomer({
        ...this.getParams()
      })
    },
    async getProductLine () {
      const { code, data } = await getCustomerBuProductLine(this.info.customerId || this.info.tycId)
      if (code !== 0) return
      this.productList = data.map(item => ({ ...item, select: !!item.managerCode }))
    },
    onDelContacts (contacts) {
      this.contactsList = this.contactsList.filter(item => item.tag !== contacts.tag)
      this.showSaveBtn = true
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
      if (this.readOnly) return
      this.setContactsInfo(info)
      this.$router.push({ name: 'addContacts', query: { type: 'edit' } })
    },
    addContacts () {
      if (this.readOnly) return
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
        this.isAllowClick = true
      }).catch(() => {
        Toast('请填写完整')
        this.isAllowClick = true
      })
    },
    onLook () {
      this.setCurrentCustomer({
        ...this.getParams()
      })
      this.$router.push({ name: 'myClientVisitRecord' })
      this.isAllowClick = true
    },
    async onStar () {
      const { code, data } = await setCusStar({
        relationTableId: this.info.id,
        star: this.info.star === '1' ? '0' : '1'
      })
      if (code !== 0) return
      if (data) {
        this.info = {
          ...this.info,
          star: this.info.star === '1' ? '0' : '1'
        }
        this.setCurrentCustomer(this.info)
      }
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
.content-info {
  position: relative;
  .star-btn {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
    color: #f59a23;
    font-size: .22rem;
    padding: .06rem;
  }
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
