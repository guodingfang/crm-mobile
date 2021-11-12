import { getRegionInfo } from '@/api/util'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      formInfo: [
        {
          id: 'customerName',
          type: 'input',
          flex: 'column',
          label: '客户名称',
          value: '',
          required: true
        },
        {
          id: 'character',
          type: 'select',
          label: '客户性质',
          value: '',
          columns: [],
          required: true
        },
        {
          id: 'type',
          type: 'select',
          label: '客户类型',
          value: '',
          columns: [],
          required: true
        },
        {
          id: 'province',
          type: 'select',
          label: '所在省份',
          value: '',
          columns: [],
          required: true,
          selectConfigs: {
            label: 'regionCode',
            value: 'regionName'
          }
        },
        {
          id: 'city',
          type: 'select',
          label: '所在城市',
          value: '',
          columns: [],
          required: true,
          selectConfigs: {
            notSelect: true,
            tips: '请先选择所在省份',
            label: 'regionCode',
            value: 'regionName'
          }
        },
        {
          id: 'address',
          type: 'input',
          flex: 'column',
          label: '详细地址',
          required: true,
          placeholder: '请输入客户地址',
          value: ''
        },
        {
          id: 'constructedContent',
          type: 'input',
          flex: 'column',
          label: '已建设内容',
          placeholder: '请输入已建设内容',
          value: ''
        },
        {
          id: 'manager',
          type: 'input',
          label: '客户经理',
          value: '',
          readonly: true
        },
        {
          id: 'orgName',
          type: 'input',
          label: '业务部门',
          value: '',
          readonly: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['provinceList', 'customerCharacter', 'customerType'])
  },
  methods: {
    ...mapActions('util', ['setProvinceList', 'setCustomerCharacter', 'setCustomerType']),
    async getFormInfo (info = {}) {
      this.formInfo = this.formInfo.map(item => {
        switch (item.id) {
          case 'manager':
            return { ...item, value: this.userInfo.name }
          case 'orgName':
            return { ...item, value: this.userInfo.dept }
          default:
            return {
              ...item,
              value: info[item.id]
            }
        }
      })

      // 只读状态
      if (this.readOnly) {
        this.formInfo = this.formInfo.map(item => ({ ...item, readonly: true }))
      }

      await this.getCustomerCharacter()
      await this.getCustomerType()
      await this.getProvince()
      await this.getCity(info.provinceCode)
    },
    // 获取客户性质
    async getCustomerCharacter () {
      const data = this.customerCharacter || await this.setCustomerCharacter()
      this.formInfo = this.formInfo.map(item => item.id === 'character' ? {
        ...item,
        columns: data
      } : item)
    },
    // 获取客户类型
    async getCustomerType () {
      const data = this.customerType || await this.setCustomerType()
      this.formInfo = this.formInfo.map(item => item.id === 'type' ? {
        ...item,
        columns: data
      } : item)
    },
    // 获取省
    async getProvince () {
      const data = this.provinceList || await this.setProvinceList()
      this.formInfo = this.formInfo.map(item => item.id === 'province' ? {
        ...item,
        columns: data
      } : item)
    },
    // 获取市
    async getCity (parentCode) {
      if (!parentCode) return
      const { code, data } = await getRegionInfo({
        regionLevel: 1,
        parentCode: parentCode
      })
      if (code !== 0) return
      this.formInfo = this.formInfo.map(item => item.id === 'city' ? {
        ...item,
        columns: data
      } : item)
    }
  }
}
