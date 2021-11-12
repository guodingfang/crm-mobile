<template>
  <div>
    <Form ref="baseForm">
      <div class="content-info">
        <div v-for="(item, index) in formInfo" :key="index">
          <Item :info="item" @change="onChangeInput" />
        </div>
      </div>
    </Form>
    <Footer
      :btn-list="btnList"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import { Form, Item } from '@/components/Form'
import { Toast } from 'vant'
import form from './mixins/form'

export default {
  name: 'trackDetails',
  mixins: [form],
  components: {
    Footer,
    Form,
    Item
  },
  data () {
    return {
      btnList: [
        { status: 'btn1', name: '确定', type: 'confirm' }
      ]
    }
  },
  methods: {
    onChangeInput () {
      console.log('@@')
    },
    onConfirm () {
      this.$refs.baseForm.$refs.useForm.validate().then(async () => {
        Toast('修改成功')
      }).catch(() => {
        Toast('请填写完整')
      })
    }
  }
}
</script>

<style scoped>

</style>
