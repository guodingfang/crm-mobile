<template>
  <div class="item">
    <Item
      v-for="(item, index) in contactsItem"
      :key="index"
      :info="item"
      @change="onChangeInput" />
  </div>
</template>

<script>
import { Item } from '@/components/Form'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ContactsItem',
  components: {
    Item
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      roleNameColumns: [],
      roleName: ''
    }
  },
  computed: {
    ...mapGetters(['contactsRol']),
    _roleName () {
      const role = this.contactsRol.find(item => item.dicCode === this.info.roleName)
      return role ? role.dicName : ''
    },
    contactsItem () {
      return [
        {
          id: 'name',
          type: 'input',
          label: '联系人姓名',
          value: this.info.name || '',
          required: true
        },
        {
          id: 'phoneNum',
          type: 'input',
          label: '联系电话',
          value: this.info.phoneNum || '',
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
          value: this.info.otherContacts || '',
          required: false
        },
        {
          id: 'roleName',
          type: 'select',
          label: '角色',
          required: true,
          value: this.roleName || this._roleName,
          columns: this.roleNameColumns,
          selectConfigs: {
            label: 'dicCode',
            value: 'dicName'
          }
        },
        {
          id: 'orgName',
          type: 'input',
          label: '联系人部门',
          value: this.info.orgName || '',
          required: true
        },
        {
          id: 'job',
          type: 'input',
          label: '联系人职务',
          value: this.info.job || '',
          required: true
        },
        {
          id: 'notes',
          type: 'input',
          flex: 'column',
          label: '备注',
          placeholder: '请输入',
          value: this.info.notes || '',
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
  mounted () {
    this.getContactsRol()
  },
  methods: {
    ...mapActions('util', ['setContactsRol']),
    async getContactsRol () {
      this.roleNameColumns = this.contactsRol || await this.setContactsRol()
    },
    async asyncValidator (val) {
      if (val) {
        return /^1[3456789]\d{9}$/.test(val)
      }
      return true
    },
    onChangeInput ({ type, id, value, configs }) {
      if (type === 'select') {
        this.$emit('change', {
          contacts: {
            ...this.info,
            [`${id}`]: value[configs.label]
          }
        })
        if (id === 'roleName') {
          this.roleName = value[configs.value]
        }
      } else {
        this.$emit('change', {
          contacts: {
            ...this.info,
            [`${id}`]: value
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.item {
  //margin-bottom: .12rem;
  //.cardRadios()
}
</style>
