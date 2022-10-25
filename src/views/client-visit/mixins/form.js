import { getContactsList, getCustomerList } from '@/api/customer'
import { judgeClockIsEdit } from '@/api/user'
import { mapActions } from 'vuex'

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
            value: 'customerName',
            defaultIndex: 1
          },
          slotTop: true,
          slotBottom: true,
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
            rows: 2,
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
          id: 'visitType',
          type: 'select',
          label: '拜访类型',
          value: '',
          columns: [],
          required: true,
          selectConfigs: {
            label: 'dicCode',
            value: 'dicName'
          }
        },
        {
          id: 'liaisonName',
          type: 'select',
          label: '拜访人员',
          value: '',
          columns: [],
          showToolbar: false,
          selectConfigs: {
            notSelect: true,
            tips: '请先选择客户',
            label: 'id',
            value: 'name'
          },
          slotBottom: true,
          slotBottomName: 'slotUserBottom',
          slotOption: true,
          slotOptionName: 'slotOption',
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
    ...mapActions('util', ['setVisiType']),
    async getFormInfo (info = {}) {
      /**
       * '0' 可以编辑
       * '1' 本周内，可以编辑后三项
       * '2' 不可编辑
       * @type {string}
       */
      if (this.currentVisit.managerName !== this.userInfo.name) {
        this.status = '2'
      } else {
        if (this.currentVisit.status === '1') {
          const { code, data } = await judgeClockIsEdit(this.currentVisit.id)
          if (code === 0) {
            this.status = data ? '1' : '2'
          }
        }
      }
      if (this.status === '2') {
        this.btnList = []
      }
      this.formInfo = this.formInfo.map(item => {
        switch (item.id) {
          case 'location':
            return { ...item, value: this.currentVisit.location }
          case 'visitType':
            return { ...item, value: info.visitTypeName }
          case 'positionTime':
            return { ...item, value: this.currentVisit.positionTime }
          case 'customerName':
          case 'collaborators':
            return { ...item, value: info[item.id], readonly: this.status !== '0' }
          case 'liaisonName':
            return { ...item, value: info.liaisonList ? info.liaisonList.map(item => item.name).join(',') : '', readonly: this.status !== '0' }
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
      await this.getCustomerList({ reset: true }, info)
      await this.getVisiType()
    },
    async getCustomerList (option = {}, info) {
      const { reset = false, ...args } = option
      const { code, data, total } = await getCustomerList({
        status: '1',
        page: this.page,
        limit: this.limit,
        ...args
      })
      if (code !== 0) return
      this.complete = total <= this.page * this.limit
      this.customerList = reset ? data : [...this.customerList, ...data]
      const selectCustomer = this.customerList.find(item => item.customerName === this.info.customerName)
      this.formInfo = this.formInfo.map(item => item.id === 'customerName' ? {
        ...item,
        columns: this.customerList
      } : item.id === 'liaisonName' ? {
        ...item,
        columns: (selectCustomer?.liaisonList || [])
          .map(item => info && info.liaisonList
            ? ({ ...item, select: info.liaisonList.find(i => i.id === item.id) })
            : ({ ...item, select: false })),
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
    },
    defaultType (info) {
      if (info && info.customerCode === 'CARBON') {
        this.formInfo = this.formInfo.map(item => {
          if (item.id === 'visitType') {
            const { columns, selectConfigs } = item
            const colData = columns.find(col => col.dicCode === 'CRM_VISIT_TYPE02')
            this.info = {
              ...this.info,
              visitType: colData[selectConfigs.label],
              visitTypeName: colData[selectConfigs.value]
            }
            return {
              ...item,
              value: colData.dicName
            }
          } else {
            return item
          }
        })
      } else {
        this.formInfo = this.formInfo.map(item => item.id === 'visitType' ? { ...item, value: '' } : item)
        this.info = {
          ...this.info,
          visitType: '',
          visitTypeName: ''
        }
      }
    },
    async changeContactsList () {
      const { code, data } = await getContactsList(this.info.customerId)
      if (code !== 0) return
      this.formInfo = this.formInfo.map(item => {
        if (item.id === 'liaisonName') {
          const columns = data.map(col => ({ ...col, select: item.columns.find(i => i.id === col.id) ? item.columns.find(i => i.id === col.id).select : false }))
          return {
            ...item,
            columns
          }
        } else {
          return item
        }
      })
    },
    async getVisiType () {
      const data = this.customerCharacter || await this.setVisiType()
      this.formInfo = this.formInfo.map(item => item.id === 'visitType' ? {
        ...item,
        columns: data
      } : item)
    }
  }
}
