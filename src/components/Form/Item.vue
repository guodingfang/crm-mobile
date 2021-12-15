<template>
  <div>
    <div class="item" v-if="info.type === 'input'">
      <Field
        :class="itemStyle"
        v-model="info.value"
        :label="info.label"
        :placeholder="info.placeholder || '请输入'"
        @input="onInputChange"
        :readonly="info.readonly"
        :input-align="info.flex === 'column' ? 'left' : 'right'"
        :rules="formRules"
        v-bind="model"
      >
        <template v-if="info.postfix" #right-icon>
          <div>{{ info.postfix.content }}</div>
        </template>
      </Field>
    </div>
    <div class="item" v-if="info.type === 'select'">
      <Field
        readonly
        clickable
        :class="itemStyle"
        :value="info.value"
        :label="info.label"
        input-align="right"
        placeholder="请选择"
        @click="onOpenSelect"
        :rules="formRules"
      >
        <template v-if="info.postfix" #right-icon>
          <div>{{ info.postfix.content }}</div>
        </template>
      </Field>
      <Popup v-model="showPicker" round position="bottom">
        <Picker
          show-toolbar
          :columns="info.columns"
          :value-key="selectConfigs.value"
          :readonly="info.readonly"
          :default-index="selectConfigs.defaultIndex"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </Popup>
    </div>
  </div>
</template>

<script>
import { Field, Popup, Picker, Toast } from 'vant'
export default {
  name: 'Item',
  components: {
    Field,
    Popup,
    Picker
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
      value: '',
      showPicker: false
    }
  },
  computed: {
    model () {
      const { type = 'text', ...agrs } = this.info.model || {}
      const result = {
        type,
        ...agrs
      }
      return result
    },
    formRules () {
      const { rules = [] } = this.info
      return [...rules, {
        required: this.info.required,
        trigger: 'onSubmit'
      }]
    },
    itemStyle () {
      let _class = ''
      if (this.info.flex === 'column') {
        _class += ' column'
      }
      if (this.info.required) {
        _class += ' required'
      }
      return _class
    },
    selectConfigs () {
      let selectConfigs = {}
      let defaultIndex = 0
      if (this.info.selectConfigs) {
        selectConfigs = { ...this.info.selectConfigs }
      } else {
        selectConfigs = {
          label: 'dicCode',
          value: 'dicName'
        }
      }
      this.info.columns.map((item, index) => {
        if (item[selectConfigs.value] === this.info.value) {
          defaultIndex = index
        }
      })
      return { ...selectConfigs, defaultIndex }
    }
  },
  mounted () {

  },
  methods: {
    onOpenSelect () {
      if (this.selectConfigs.notSelect) {
        Toast(this.selectConfigs.tips)
        return
      }
      this.showPicker = true
    },
    onInputChange (value) {
      this.$emit('change', {
        type: 'input',
        id: this.info.id,
        value
      })
    },
    onConfirm (value) {
      this.value = value.dicName
      this.$emit('change', {
        type: 'select',
        configs: this.selectConfigs,
        id: this.info.id,
        value
      })
      this.showPicker = false
    }
  }
}
</script>

<style scoped lang="less">
.item {
  background-color: @whiteColor;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1px;
  /deep/ .van-cell {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: .1rem .06rem;
    box-sizing: border-box;
    .van-field__label {
      color: #646566;
      font-size: .14rem;
    }
    .van-field__value {
      color: #969799;
      font-size: .14rem;
      textarea {
        -webkit-user-select: auto !important;
      }
      .van-field__word-limit {
        color: @tipsColor;
      }
    }
    &::after {
      border: none;
    }
  }
}
.column {
  flex-direction: column;
}
.required {
  /deep/ .van-field__label {
    span {
      position: relative;
      &:after {
        content: '*';
        position: absolute;
        right: -.08rem;
        top: 0;
        bottom: 0;
        margin: auto;
        color: @regColor;
      }
    }
  }
  /deep/ .van-field__value {
    .van-field__error-message {
      text-align: right;
    }
  }
}
</style>
