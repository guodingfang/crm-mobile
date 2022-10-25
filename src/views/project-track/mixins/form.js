import { getCompetitorList } from '@/api/competitor'
import moment from 'moment'
import { projectModelContrast } from '@/config/config'

export default {
  data () {
    return {
      formInfo: [
        {
          id: 'projectName',
          type: 'input',
          flex: 'column',
          label: '项目',
          required: true,
          value: '',
          readonly: true,
          hide: false
        },
        {
          id: 'beforeStatus',
          type: 'select',
          label: '售前订单状态',
          required: true,
          value: '',
          columns: []
        },
        {
          id: 'projectModel',
          type: 'select',
          label: '项目模式',
          required: true,
          value: '',
          columns: [],
          selectConfigs: {
            label: 'dicId',
            value: 'dicName'
          }
        },
        {
          id: 'buildPeriod',
          type: 'input',
          label: '建设时长(月)',
          required: true,
          value: '',
          model: {
            type: 'digit'
          }
        },
        {
          id: 'ywPeriod',
          type: 'input',
          label: '服务时长(月)',
          required: true,
          value: '',
          model: {
            type: 'digit'
          }
        },
        {
          id: 'jsContractMoney',
          type: 'input',
          label: '建设合同额',
          required: true,
          value: '',
          model: {
            type: 'number'
          },
          postfix: {
            type: 'text',
            content: '元'
          }
        },
        {
          id: 'ywContractMoney',
          type: 'input',
          label: '服务合同额',
          required: true,
          value: '',
          model: {
            type: 'number'
          },
          postfix: {
            type: 'text',
            content: '元'
          }
        },
        {
          id: 'yjMoney',
          type: 'input',
          label: '预计签单金额',
          readonly: true,
          value: '',
          postfix: {
            type: 'text',
            content: '元'
          }
        },
        {
          id: 'winRate',
          type: 'select',
          label: '赢率',
          required: true,
          value: '',
          columns: [],
          postfix: {
            type: 'text',
            content: '%'
          }
        },
        {
          id: 'expectDateBid',
          type: 'dateSelect',
          label: '预计投标日期',
          value: ''
        },
        {
          id: 'expectDateSiging',
          type: 'dateSelect',
          label: '预计签单日期',
          required: true,
          value: '',
          model: {
            minDate: new Date()
          }
        },
        {
          id: 'competitor',
          type: 'input',
          label: '竞争对手',
          value: '',
          placeholder: '请选择',
          readonly: true,
          model: {
            allowClick: true
          }
        },
        {
          id: 'weeklyTask',
          type: 'input',
          flex: 'column',
          label: '本周进展',
          placeholder: '请输入本周进展',
          value: '',
          required: true,
          model: {
            type: 'textarea',
            maxlength: 300,
            'show-word-limit': true,
            rows: 2,
            autosize: true
          }
        },
        {
          id: 'nextPlan',
          type: 'input',
          flex: 'column',
          label: '下周计划',
          placeholder: '请输入下周计划',
          value: '',
          required: true,
          model: {
            type: 'textarea',
            maxlength: 300,
            'show-word-limit': true,
            rows: 2,
            autosize: true
          }
        }
      ],
      formInfoOld: []
    }
  },
  computed: {
  },
  methods: {
    async getFormInfo (info = {}) {
      this.resetFormInfo(info.projectModel)
      this.initFormInfo(info)
      this.weekAmount = info.weekNum
      this.formInfo = this.formInfo.map(item => {
        switch (item.id) {
          case 'projectName':
            return { ...item, value: this.currentProject.projectName }
          case 'yjMoney':
            return { ...item, value: +info.jsContractMoney + +info.ywContractMoney }
          case 'beforeStatus':
            return { ...item, value: info.beforeStatusName || '' }
          case 'projectModel':
            return { ...item, value: info.projectModelName || '' }
          case 'expectDateBid':
            return { ...item, value: info.expectDateBid ? moment(info.expectDateBid).format('YYYY-MM-DD') : '' }
          case 'expectDateSiging':
            return { ...item, value: moment(info.expectDateSiging || new Date()).format('YYYY-MM-DD') }
          default:
            return {
              ...item,
              value: info[item.id]
            }
        }
      })
      this.getWinRateColumns()
      await this.getPreSaleStatus()
      await this.getProjectModel()
    },

    initFormInfo (info) {
      const { isTender = '0' } = info
      if (isTender === '1') {
        this.formInfo = this.formInfo.map(item => item.id === 'expectDateBid' ? { ...item, hide: false } : item)
      } else {
        this.formInfo = this.formInfo.map(item => item.id === 'expectDateBid' ? { ...item, hide: true } : item)
      }
      // 只读状态
      if (this.readOnly) {
        this.formInfo = this.formInfo.map(item => ({ ...item, readonly: true }))
      }
    },

    resetFormInfo (projectModel) {
      const _model = projectModelContrast[projectModel]
      if (_model === 'XMMS03' || _model === 'XMMS04' || _model === 'XMMS05') {
        this.formInfo = this.formInfo.map(item => item.id === 'ywPeriod' ? { ...item, value: '', hide: false } : item)
      } else {
        this.formInfo = this.formInfo.map(item => item.id === 'ywPeriod' ? { ...item, value: '', hide: true } : item)
      }

      if (_model !== 'XMMS03') {
        this.formInfo = this.formInfo.map(item => {
          if (item.id === 'jsContractMoney') return { ...item, value: '', hide: true }
          if (item.id === 'ywContractMoney') return { ...item, value: '', hide: true }
          if (item.id === 'yjMoney') return { ...item, value: '', required: true, readonly: false, placeholder: '请输入' }
          return item
        })
      } else {
        this.formInfo = this.formInfo.map(item => {
          if (item.id === 'jsContractMoney') return { ...item, value: '', hide: false }
          if (item.id === 'ywContractMoney') return { ...item, value: '', hide: false }
          if (item.id === 'yjMoney') return { ...item, value: '', required: false, readonly: true, placeholder: '建设合同额+运维合同额' }
          return item
        })
      }

      // if (_model === 'XMMS05') {
      //   this.formInfo = this.formInfo.map(item => item.id === 'buildPeriod' ? { ...item, hide: false, required: false } : item)
      // } else {
      //   this.formInfo = this.formInfo.map(item => item.id === 'buildPeriod' ? { ...item, hide: false, required: true } : item)
      // }
    },

    getWinRateColumns () {
      const data = Array.apply(null, { length: 10 }).map((item, index) => {
        return `${(index + 1) * 10}%`
      })
      this.formInfo = this.formInfo.map(item => item.id === 'winRate' ? {
        ...item,
        columns: data
      } : item)
    },

    async getPreSaleStatus () {
      const { isTender = '0' } = this.info
      const data = await this.setPreSaleStatus()
      const columnsData = isTender === '1' ? data : data.filter(item => item.dicName !== '投标中')
      this.formInfo = this.formInfo.map(item => item.id === 'beforeStatus' ? {
        ...item,
        columns: columnsData
      } : item)
    },

    async getProjectModel () {
      const data = await this.setProjectModel()
      this.formInfo = this.formInfo.map(item => item.id === 'projectModel' ? {
        ...item,
        columns: data
      } : item)
    },
    async _getCompetitorList () {
      const { code = 0, data = [] } = await getCompetitorList({
        projectId: this.projectId
      })
      if (code !== 0) {
        return
      }
      const competitorList = data.filter(item => !!item)
      this.formInfo = this.formInfo.map(item => item.id === 'competitor' ? {
        ...item,
        value: competitorList.length ? `已选${competitorList.length}个竞争对手` : '没有选择竞争对手'
      } : item)
      this.competitorList = competitorList
    }
  }
}
