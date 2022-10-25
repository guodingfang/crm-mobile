<template>
  <div>
    <Form ref="baseForm">
      <Title class="title" title="联系人信息">
        <template #right>
          <div class="title-btn" :class="{'not-btn': isMain}" @click="toggleMain">{{btnText}}</div>
        </template>
      </Title>
      <div class="item">
        <Item
          v-for="(item, index) in formInfo"
          :key="index"
          :info="item"
          @change="onChangeInput" />
      </div>
    </Form>
    <Footer
      :btn-list="btnList"
      :is-allow-click.sync="isAllowClick"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import { Form, Item } from '@/components/Form'
import Footer from '@/components/Footer'
import { Toast } from 'vant'
import { addContacts } from '@/api/customer'
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'addContacts',
  components: {
    Title,
    Form,
    Item,
    Footer
  },
  data () {
    return {
      type: '',
      btnList: [
        { status: 'btn1', name: '保存', type: 'confirm' }
      ],
      info: null,
      btnText: '',
      isMain: false,
      isAllowClick: true,
      formInfo: [
        {
          id: 'name',
          type: 'input',
          label: '联系人姓名',
          value: '',
          required: true
        },
        {
          id: 'phoneNum',
          type: 'input',
          label: '联系电话',
          value: '',
          required: false,
          rules: [{
            required: false,
            validator: this.asyncValidator,
            message: '请填写正确手机号',
            trigger: 'onBlur'
          }]
        },
        {
          id: 'otherContacts',
          type: 'input',
          label: '其他联系方式',
          value: '',
          required: false
        },
        {
          id: 'roleName',
          type: 'select',
          label: '角色',
          required: true,
          value: '',
          columns: [],
          selectConfigs: {
            label: 'dicCode',
            value: 'dicName'
          }
        },
        {
          id: 'orgName',
          type: 'input',
          label: '联系人部门',
          value: '',
          required: true
        },
        {
          id: 'job',
          type: 'input',
          label: '联系人职务',
          value: '',
          required: true
        },
        {
          id: 'notes',
          type: 'input',
          flex: 'column',
          label: '备注',
          placeholder: '请输入',
          value: '',
          required: false,
          model: {
            type: 'textarea',
            maxlength: 300,
            'show-word-limit': true,
            rows: 2,
            autosize: true
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'contactsInfo'])
  },
  watch: {
    contactsInfo: {
      handler: function (val) {
        const { mainContact = 1 } = val
        this.btnText = mainContact === 0 ? '已是主要联系人' : '设为主要联系人'
        this.isMain = mainContact === 0
        this.info = val
        this.formInfo = this.formInfo.map(item => ({
          ...item,
          value: val ? val[item.id] : ''
        }))
      },
      immediate: true
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    const { type = '' } = this.$route.query
    this.type = type
    this.getContactsRol()
  },
  methods: {
    ...mapActions('customer', ['setContactsInfo']),
    ...mapActions('util', ['setContactsRol']),
    async asyncValidator (val) {
      if (val) {
        return /^1[3456789]\d{9}$/.test(val)
      }
      return true
    },
    async getContactsRol () {
      const roleNameColumns = await this.setContactsRol()
      const role = roleNameColumns.find(item => item.dicCode === this.info.roleName)
      this.formInfo = this.formInfo.map(item => item.id === 'roleName' ? {
        ...item,
        value: role ? role.dicName : '',
        columns: roleNameColumns
      } : item)
    },
    toggleMain () {
      if (this.isMain) return
      this.info = {
        ...this.info,
        mainContact: 0
      }
      this.isMain = true
      this.btnText = '已是主要联系人'
    },
    onChangeInput ({ type, id, value, configs }) {
      if (type === 'select') {
        this.info = {
          ...this.info,
          [`${id}`]: value[configs.label]
        }
        if (id === 'roleName') {
          this.formInfo = this.formInfo.map(item => item.id === 'roleName'
            ? { ...item, value: value[configs.value] }
            : item)
        }
      } else {
        this.info = {
          ...this.info,
          [`${id}`]: value
        }
      }
    },
    async onConfirm () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        let params = {
          ...this.info
        }
        if (this.type === 'add') {
          params = {
            ...params,
            id: '',
            createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            creater: this.userInfo.name,
            uploadDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        } else if (this.type === 'edit') {
          params = {
            ...params,
            uploadDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        }
        const { code, msg = '' } = await addContacts({
          ...params
        })
        if (code === 0) {
          this.onBack()
          Toast(this.type === 'add' ? '保存成功' : '修改成功')
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
  padding: 0 .12rem;
  .title-btn {
    margin-left: auto;
    color: @whiteColor;
    font-size: .12rem;
    padding: .03rem .06rem;
    border-radius: .06rem;
    background-color: rgb(25, 158, 216);
    &.not-btn {
      background-color: #aaa;
    }
  }
}
.item {
  padding: 0 0.12rem;
}
</style>
