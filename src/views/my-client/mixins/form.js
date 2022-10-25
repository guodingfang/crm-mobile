import { getRegionInfo } from '@/api/util'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment/moment'

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
          placeholder: '请输入客户名称',
          readonly: true
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
          id: 'estiblishTime',
          type: 'input',
          label: '注册日期',
          readonly: true,
          placeholder: '',
          value: ''
        },
        {
          id: 'regCapitalAmount',
          type: 'input',
          label: '注册资本',
          readonly: true,
          placeholder: '',
          value: ''
        },
        {
          id: 'creditCode',
          type: 'input',
          label: '统一社会信用代码',
          readonly: true,
          placeholder: '',
          value: ''
        },
        {
          id: 'legalPersonName',
          type: 'input',
          label: '法人',
          readonly: true,
          placeholder: '',
          value: ''
        },
        {
          id: 'province',
          type: 'input',
          label: '所在省份',
          value: '',
          columns: [],
          readonly: true
          // selectConfigs: {
          //   label: 'regionCode',
          //   value: 'regionName'
          // }
        },
        {
          id: 'city',
          type: 'input',
          label: '所在城市',
          value: '',
          columns: [],
          readonly: true
          // selectConfigs: {
          //   notSelect: true,
          //   tips: '请先选择所在省份',
          //   label: 'regionCode',
          //   value: 'regionName'
          // }
        },
        {
          id: 'taxAddress',
          type: 'input',
          flex: 'column',
          label: '详细地址',
          readonly: true,
          placeholder: '请输入客户地址',
          value: ''
        },
        {
          id: 'historyNames',
          type: 'input',
          label: '曾用名',
          readonly: true,
          placeholder: '暂无',
          value: ''
        },
        {
          id: 'constructedContent',
          type: 'input',
          flex: 'column',
          label: '已建设内容',
          placeholder: '请输入已建设内容',
          value: ''
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['provinceList', 'customerCharacter', 'customerType'])
  },
  methods: {
    ...mapActions('util', ['setProvinceList', 'setCustomerCharacter', 'setCustomerType']),

    async getFormInfo (info) {
      console.log('info', info)
      this.formInfo = this.formInfo.map(item => {
        switch (item.id) {
          case 'estiblishTime':
            return { ...item, value: info.estiblishTime ? moment(info.estiblishTime).format('YYYY-MM-DD') : '-' }
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
