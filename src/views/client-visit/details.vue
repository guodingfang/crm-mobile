<template>
  <div>
    <Loading v-show="pageLoading" />

    <Form ref="formBase">
      <Title class="title" title="拜访信息填写"></Title>
      <div class="content-list">
        <div v-for="(item, index) in formInfo" :key="index">
          <Item :info="item" @change="onChangeInput" />
        </div>
      </div>
    </Form>
    <Footer
      v-if="btnList.length"
      :btn-list="btnList"
      @confirm="onConfirm"
      @back="onBack"
    />
  </div>

</template>

<script>
import Loading from '@/components/Loading'
import Footer from '@/components/Footer'
import Title from '@/components/Title'
import { Form, Item } from '@/components/Form'
import { addVisitRecord, queryCustomerVisitDetails } from '@/api/visit'
import { mapGetters, mapActions } from 'vuex'
import form from './mixins/form'
import { Toast } from 'vant'
import dayjs from 'dayjs'

export default {
  name: 'ClientVisit',
  mixins: [form],
  components: {
    Loading,
    Footer,
    Title,
    Form,
    Item
  },
  data () {
    return {
      pageLoading: true,
      btnList: [
        { status: 'btn1', name: '确定', type: 'confirm' }
      ],
      status: '0',
      info: {},
      positionId: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'currentVisit'])
  },
  mounted () {
    this.queryCustomerVisitDetails()
  },
  beforeRouteEnter (to, from, next) {
    window.scrollTo(0, 0)
    next()
  },
  methods: {
    ...mapActions('visit', ['setClockRecordId']),

    async queryCustomerVisitDetails () {
      const { code, data } = await queryCustomerVisitDetails(this.currentVisit.id)
      if (code !== 0) return
      this.info = data || {}
      await this.getFormInfo(this.info)
      this.pageLoading = false
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
        return
      }

      this.formInfo = this.formInfo.map(item => item.id === id ? {
        ...item,
        value: value[configs.value]
      } : item)
      if (id === 'customerName') {
        this.getContactsList(value.id)
        this.info = {
          ...this.info,
          customerName: value[configs.value],
          customerId: value[configs.label]
        }
      }
      if (id === 'liaisonName') {
        this.info = {
          ...this.info,
          liaisonName: value[configs.value],
          liaisonId: value[configs.label]
        }
      }
    },
    async onConfirm () {
      let params = {
        ...this.info,
        positionId: this.currentVisit.id
      }
      if (this.status === '0') {
        params = {
          ...params,
          createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          creater: this.userInfo.name
        }
      }
      if (this.status === '1') {
        params = {
          ...params,
          updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.$refs.formBase.$refs.useForm.validate().then(async () => {
        const { code, msg = '' } = await addVisitRecord({
          ...params
        })
        if (code === 0) {
          Toast('保存完成')
          this.setClockRecordId(this.currentVisit.id)
          this.onBack()
        } else {
          Toast(msg)
        }
      }).catch(() => {
        Toast('请填写完整')
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
  margin: 0 .12rem;
}
.content-list {
  margin: 0 .12rem;
  .cardRadios()
}
</style>
