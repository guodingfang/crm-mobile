
export default {
  data () {
    return {
      formInfo: [
        {
          id: 'customerName',
          type: 'input',
          flex: 'column',
          label: '项目',
          value: '',
          readonly: true
        },
        {
          id: 'character',
          type: 'select',
          label: '售前状态',
          value: '',
          columns: []
        },
        {
          id: 'province',
          type: 'select',
          label: '项目模式',
          value: '',
          columns: [],
          selectConfigs: {
            label: 'regionCode',
            value: 'regionName'
          }
        },
        {
          id: 'city',
          type: 'select',
          label: '运维期（月）',
          value: '',
          columns: [],
          selectConfigs: {
            label: 'regionCode',
            value: 'regionName'
          }
        },
        {
          id: 'address',
          type: 'input',
          label: '预计合同额',
          value: '',
          postfix: {
            type: 'text',
            content: '元'
          }
        },
        {
          id: 'address',
          type: 'input',
          label: '建设合同额',
          value: '',
          postfix: {
            type: 'text',
            content: '元'
          }
        },
        {
          id: 'address',
          type: 'input',
          label: '运维合同额',
          value: '',
          postfix: {
            type: 'text',
            content: '元'
          }
        },
        {
          id: 'address',
          type: 'input',
          label: '赢率',
          value: '',
          postfix: {
            type: 'text',
            content: '%'
          }
        },
        {
          id: 'address',
          type: 'input',
          label: '确定投标时间',
          value: ''
        },
        {
          id: 'manager',
          type: 'input',
          label: '预计签单时间',
          value: ''
        },
        {
          id: 'purpose',
          type: 'input',
          flex: 'column',
          label: '本周进展',
          placeholder: '请输入本周进展',
          value: '',
          required: true,
          model: {
            type: 'textarea',
            maxlength: 300,
            'show-word-limit': true
          }
        },
        {
          id: 'purpose',
          type: 'input',
          flex: 'column',
          label: '下周计划',
          placeholder: '请输入下周计划',
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
  computed: {
  },
  methods: {
  }
}
