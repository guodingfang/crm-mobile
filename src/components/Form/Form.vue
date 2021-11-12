<template>
  <Form
    ref="useForm"
    class="form"
  >
    <slot></slot>
  </Form>
</template>

<script>
import { Form } from 'vant'
export default {
  name: 'BaseForm',
  components: {
    Form
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped lang="less">
.form {

}
</style>
