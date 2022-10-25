<template>
  <div>
    <div class="header">
      <Title class="title" title="立项跟踪详情" />
      <span class="year-week">{{ yearAmount }}年第{{ weekAmount }}周</span>
    </div>
    <Form ref="baseForm">
      <div class="content-info">
        <div v-for="(item, index) in formInfo" :key="index">
          <Item :info="item" @change="onChangeInput" @click="onClickInput" />
        </div>
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
import Footer from '@/components/Footer'
import { Form, Item } from '@/components/Form'
import { Toast } from 'vant'
import form from './mixins/form'
// eslint-disable-next-line no-unused-vars
import { getWeekDetails, getWeekInit, saveWeekInfo } from '@/api/week'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { projectModelContrast } from '@/config/config'

export default {
  name: 'trackDetails',
  mixins: [form],
  components: {
    Title,
    Footer,
    Form,
    Item
  },
  computed: {
    ...mapGetters(['currentProject'])
  },
  data () {
    return {
      againRenderForm: false,
      projectId: '',
      weekId: '',
      yearAmount: '',
      weekAmount: '',
      btnList: [
        { status: 'btn1', name: '确定', type: 'confirm' }
      ],
      readOnly: false,
      isAllowClick: true
    }
  },
  mounted () {
    this.formInfoOld = [...this.formInfo]
    this.init()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'projectTrackCompetitor') {
      this.$refs.baseForm.$refs.useForm.resetValidation()
      this.formInfo = [...this.formInfoOld]
      this.againRenderForm = true
      this.readOnly = false
      this.isAllowClick = true
    }
    next()
  },
  activated () {
    if (this.againRenderForm) {
      this.init()
      this.againRenderForm = false
    }
    this._getCompetitorList()
  },
  methods: {
    ...mapActions('util', ['setProjectModel', 'setPreSaleStatus']),
    init () {
      const { id, projectId } = this.$route.query
      this.yearAmount = new Date().getFullYear()
      this.projectId = projectId
      if (id) {
        this.weekId = id
        this.getWeekDetails()
      } else {
        this.getWeekInit()
      }
    },
    async getWeekInit () {
      const { code, data, msg } = await getWeekInit({
        projectId: this.currentProject.projectId
      })
      if (code !== 0) {
        Toast(msg)
        return
      }
      this.info = data
      await this.getFormInfo(data)
    },
    async getWeekDetails () {
      const { code, data, msg } = await getWeekDetails({
        weeklyId: this.weekId
      })
      if (code !== 0) {
        Toast(msg)
        return
      }
      if (moment(data.createDate).year() === moment().year() &&
        data.weekNum !== (moment().week()).toString()) {
        this.readOnly = true
      } else {
        this.readOnly = false
      }
      this.info = data
      await this.getFormInfo(data)
    },
    onChangeInput ({ type, id, configs, value }) {
      if (type === 'input') {
        this.formInfo = this.formInfo.map(item => item.id === id ? {
          ...item,
          value: value
        } : item)
        this.info = {
          ...this.info,
          [`${id}`]: value
        }
        // 计算预计合同额
        if (id === 'jsContractMoney' || id === 'ywContractMoney') {
          const _jsContractMoney = this.info ? this.info.jsContractMoney : ''
          const _ywContractMoney = this.info ? this.info.ywContractMoney : ''
          this.formInfo = this.formInfo.map(item => item.id === 'yjMoney'
            ? { ...item, value: _jsContractMoney && _ywContractMoney ? +_jsContractMoney + +_ywContractMoney : '' }
            : item)
          this.info = {
            ...this.info,
            yjMoney: _jsContractMoney && _ywContractMoney ? +_jsContractMoney + +_ywContractMoney : ''
          }
        }
        return
      } else if (type === 'dateSelect') {
        this.formInfo = this.formInfo.map(item => item.id === id ? {
          ...item,
          value: moment(value).format('YYYY-MM-DD')
        } : item)
        this.info = {
          ...this.info,
          [`${id}`]: moment(value).format('YYYY-MM-DD')
        }
        return
      } else if (id === 'winRate') {
        this.formInfo = this.formInfo.map(item => item.id === id ? {
          ...item,
          value: `${parseInt(value)}`
        } : item)
        this.info = {
          ...this.info,
          [`${id}`]: `${parseInt(value)}`
        }
        return
      }
      if (id === 'projectModel') {
        this.resetFormInfo(value.dicId)
      }

      this.formInfo = this.formInfo.map(item => item.id === id ? {
        ...item,
        value: value[configs.value]
      } : item)
      this.info = {
        ...this.info,
        [`${id}Name`]: value[configs.value],
        [`${id}`]: value[configs.label]
      }
    },
    onClickInput (info) {
      if (this.readOnly) return
      if (info.id === 'competitor') {
        this.$router.push({ name: 'projectTrackCompetitor', query: { projectId: this.projectId } })
      }
    },
    onConfirm () {
      if (this.readOnly) {
        this.onBack()
        this.isAllowClick = true
        return
      }
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        const { jsContractMoney, ywContractMoney, yjMoney, ...args } = this.info
        let params = {
          projectId: this.currentProject.projectId
        }
        const model = projectModelContrast[this.info.projectModel]
        if (model === 'XMMS03') {
          params = {
            ...params,
            ...args,
            jsContractMoney,
            ywContractMoney
          }
        } else {
          if (model === 'XMMS01' || model === 'XMMS02') {
            params = {
              ...params,
              ...args,
              jsContractMoney: yjMoney,
              ywContractMoney: ''
            }
          } else {
            params = {
              ...params,
              ...args,
              jsContractMoney: '',
              ywContractMoney: yjMoney
            }
          }
        }

        const { code, msg } = await saveWeekInfo({ ...params })
        if (code !== 0) {
          Toast(msg)
          return
        }
        Toast('修改成功')
        this.onBack()
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
.header {
  position: relative;
  .year-week {
    position: absolute;
    top: 0;
    bottom: 0;
    right: .12rem;
    margin: auto;
    color: #333333;
    font-size: .12rem;
    display: flex;
    align-items: center;
  }
}
.content-info {
  margin: 0 .12rem;
  .cardRadios()
}
.title {
  padding-left: .12rem;
}
</style>
