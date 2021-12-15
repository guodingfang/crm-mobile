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

    }
  },
  computed: {
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
          required: true,
          rules: [{
            pattern: /^1[3456789]\d{9}$/,
            message: '请填写正确手机号',
            trigger: 'onBlur'
          }]
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
        }
      ]
    }
  },
  methods: {
    onChangeInput ({ id, value }) {
      this.$emit('change', {
        contacts: {
          ...this.info,
          [`${id}`]: value
        }
      })
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
