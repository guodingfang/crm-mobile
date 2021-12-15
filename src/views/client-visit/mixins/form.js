import { getCustomerList } from '@/api/customer'
import { judgeClockIsEdit } from '@/api/user'

export default {
  data () {
    return {
      formInfo: [
        {
          id: 'customerName',
          type: 'select',
          label: '客户',
          value: '',
          columns: [],
          selectConfigs: {
            label: 'id',
            value: 'customerName'
          },
          required: true
        },
        {
          id: 'location',
          type: 'input',
          flex: 'column',
          label: '地点',
          value: '',
          readonly: true,
          model: {
            type: 'textarea',
            autosize: true
          }
        },
        {
          id: 'positionTime',
          type: 'input',
          label: '定位时间',
          value: '',
          readonly: true
        },
        {
          id: 'liaisonName',
          type: 'select',
          label: '拜访人员',
          value: '',
          columns: [],
          selectConfigs: {
            notSelect: true,
            tips: '请先选择客户',
            label: 'id',
            value: 'name'
          },
          required: true
        },
        {
          id: 'collaborators',
          type: 'input',
          label: '协同人员',
          value: ''
        },
        {
          id: 'purpose',
          type: 'input',
          flex: 'column',
          label: '拜访目的',
          placeholder: '请输入拜访目的',
          value: '',
          required: true,
          model: {
            maxlength: 50,
            'show-word-limit': true
          }
        },
        {
          id: 'result',
          type: 'input',
          flex: 'column',
          label: '沟通结果',
          placeholder: '请输入沟通结果',
          value: '',
          required: true,
          model: {
            type: 'textarea',
            maxlength: 300,
            'show-word-limit': true
          }
        },
        {
          id: 'plan',
          type: 'input',
          flex: 'column',
          label: '后续行动计划',
          placeholder: '请输入后续行动计划',
          value: '',
          required: true,
          model: {
            type: 'textarea',
            maxlength: 300,
            'show-word-limit': true
          }
        }
      ]
    }
  },
  methods: {
    async getFormInfo (info = {}) {
      console.log('currentVisit', this.currentVisit)
      /**
       * '0' 可以编辑
       * '1' 本周内，可以编辑后三项
       * '2' 不可编辑
       * @type {string}
       */
      if (this.currentVisit.status === '1') {
        const { code, data } = await judgeClockIsEdit(this.currentVisit.id)
        if (code === 0) {
          this.status = data ? '1' : '2'
        }
      }
      if (this.status === '2') {
        this.btnList = []
      }
      this.formInfo = this.formInfo.map(item => {
        switch (item.id) {
          case 'location':
            return { ...item, value: this.currentVisit.location }
          case 'positionTime':
            return { ...item, value: this.currentVisit.positionTime }
          case 'customerName':
          case 'collaborators':
          case 'liaisonName':
            return { ...item, value: info[item.id], readonly: this.status !== '0' }
          case 'purpose':
          case 'result':
          case 'plan':
            return { ...item, value: info[item.id], readonly: this.status === '2' }
          default:
            return {
              ...item,
              value: info[item.id]
            }
        }
      })
      await this.getCustomerList(info)
    },
    async getCustomerList (info) {
      const { code, data } = await getCustomerList({
        limit: 10000000
      })
      if (code !== 0) return
      this.customerList = data
      const selectCustomer = this.customerList.find(item => item.customerName === info.customerName)
      this.formInfo = this.formInfo.map(item => item.id === 'customerName' ? {
        ...item,
        columns: this.customerList
      } : item.id === 'liaisonName' ? {
        ...item,
        columns: selectCustomer?.liaisonList || [],
        selectConfigs: { ...item.selectConfigs, notSelect: !selectCustomer }
      } : item)
    },
    getContactsList (customerId) {
      const contactsList = this.customerList.find(item => item.id === customerId)?.liaisonList || []
      this.formInfo = this.formInfo.map(item => item.id === 'liaisonName' ? {
        ...item,
        columns: contactsList,
        selectConfigs: { ...item.selectConfigs, notSelect: false }
      } : item)
    }
  }
}
