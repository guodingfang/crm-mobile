<template>
  <Popup
    class="contacts-container"
    v-model="showUserPop"
    position="bottom"
    round
    :style="{ height: '70vh' }"
  >
    <div class="contacts-content">
      <Form ref="baseForm" class="contacts-form">
        <div class="item">
          <Item
            v-for="(item, index) in formInfo"
            :key="index"
            :info="item"
            @change="onChangeInput" />
        </div>
      </Form>
      <div class="add-btn" @click="onAddUser">添加联系人</div>
    </div>
  </Popup>
</template>

<script>
import { Popup, Toast } from 'vant'
import { Form, Item } from '@/components/Form'
import { mapActions, mapGetters } from 'vuex'
import dayjs from 'dayjs'
import { addContacts } from '@/api/customer'
export default {
  name: 'addUserPop',
  components: {
    Popup,
    Form,
    Item
  },
  props: {
    showPop: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      info: null,
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
    ...mapGetters(['userInfo', 'contactsInfo']),
    showUserPop: {
      get () {
        return this.showPop
      },
      set (value) {
        this.$emit('update:showPop', false)
      }
    }
  },
  mounted () {
    this.getContactsRol()
  },
  methods: {
    ...mapActions('util', ['setContactsRol']),
    async getContactsRol () {
      const roleNameColumns = await this.setContactsRol()
      this.formInfo = this.formInfo.map(item => item.id === 'roleName' ? {
        ...item,
        columns: roleNameColumns
      } : item)
    },
    async asyncValidator (val) {
      if (val) {
        return /^1[3456789]\d{9}$/.test(val)
      }
      return true
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
    onAddUser () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        const params = {
          ...this.info,
          customerId: this.customerId,
          id: '',
          mainContact: 1,
          createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          creater: this.userInfo.name,
          uploadDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        const { code, msg = '' } = await addContacts({
          ...params
        })
        if (code === 0) {
          Toast('保存成功')
          this.$emit('changeContacts')
          this.$emit('update:showPop', false)
        } else {
          Toast(msg)
        }
      }).catch(() => {
        Toast('请填写完整')
      })
    }
  }
}
</script>

<style scoped lang="less">
.contacts-container {
  background-color: @pageBgColor;
  .contacts-content {
    padding: .12rem;
    .contacts-form {
      .cardRadios()
    }
  }
  .add-btn {
    background: @linkColor;
    color: @whiteColor;
    width: 1.6rem;
    height: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: .68rem auto;
    .cardRadios()
  }
}
</style>
