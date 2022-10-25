<template>
  <div v-if="isHide">
    <div class="item" :class="{'not-edit-item': info.readonly }" v-if="info.type === 'input'">
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
        @click="onInputClick(model.allowClick)"
      >
        <template v-if="info.postfix" #right-icon>
          <div>{{ info.postfix.content }}</div>
        </template>
      </Field>
    </div>
    <div class="item" v-else-if="info.type === 'select'">
      <Field
        readonly
        :clickable="!info.readonly"
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
      <Popup
        v-if="!info.readonly" v-model="showPicker"
        round
        get-container="body"
        position="bottom"
      >
        <Picker
          :show-toolbar="isToolbar"
          :columns="info.columns"
          :value-key="selectConfigs.value"
          :readonly="info.readonly"
          :default-index="selectConfigs.defaultIndex"
          @cancel="showPicker = false"
          @change="onPickerChange"
          @confirm="onConfirm"
        >
          <template #columns-top v-if="info.slotTop">
            <slot :name="slotTopName"></slot>
          </template>
          <template #columns-bottom v-if="info.slotBottom">
            <slot :name="slotBottomName"></slot>
          </template>
          <template #option="item" v-if="info.slotOption">
            <slot :name="slotOptionName" :item="item"></slot>
          </template>
        </Picker>
      </Popup>
    </div>
    <div class="item" v-else-if="info.type === 'dateSelect'">
      <Field
        readonly
        :clickable="!info.readonly"
        :class="itemStyle"
        :value="info.value"
        :label="info.label"
        input-align="right"
        placeholder="请选择"
        @click="onOpenDateSelect"
        :rules="formRules"
      >
        <template v-if="info.postfix" #right-icon>
          <div>{{ info.postfix.content }}</div>
        </template>
      </Field>
      <Popup
        v-if="!info.readonly" v-model="showDatePicker"
        get-container="body"
        round
        position="bottom"
      >
        <DatetimePicker
          show-toolbar
          title="选择年月日"
          type="date"
          :value="currentDate"
          :readonly="info.readonly"
          v-bind="model"
          @cancel="showDatePicker = false"
          @confirm="onDateConfirm"
        />
      </Popup>
    </div>
  </div>
</template>

<script>
import { Field, Popup, Picker, DatetimePicker, Toast } from 'vant'
export default {
  name: 'Item',
  components: {
    Field,
    Popup,
    Picker,
    DatetimePicker
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
      showPicker: false,
      showDatePicker: false
    }
  },
  computed: {
    slotTopName () {
      return this.info.slotTopName || 'slotTop'
    },
    slotBottomName () {
      return this.info.slotBottomName || 'slotBottom'
    },
    slotOptionName () {
      return this.info.slotOptionName || 'slotOption'
    },
    currentDate () {
      const { value } = this.info
      return new Date(value)
    },
    isToolbar () {
      const { showToolbar } = this.info
      return typeof showToolbar === 'undefined' ? true : showToolbar
    },
    isHide () {
      const { hide } = this.info
      return typeof hide === 'undefined' ? true : !hide
    },
    model () {
      const { type = 'text', ...args } = this.info.model || {}
      const result = {
        type,
        ...args
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
      if (selectConfigs.defaultIndex) {
        return { ...selectConfigs }
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
    onInputClick (allowClick) {
      if (allowClick) {
        this.$emit('click', this.info)
      }
    },
    onOpenSelect () {
      if (this.info.readonly) return
      if (this.selectConfigs.notSelect) {
        Toast(this.selectConfigs.tips)
        return
      }
      this.showPicker = true
    },
    onOpenDateSelect () {
      if (this.info.readonly) return
      this.showDatePicker = true
    },
    onInputChange (value) {
      this.$emit('change', {
        type: 'input',
        id: this.info.id,
        value
      })
    },
    onPickerChange (picker, value, index) {
      this.$emit('pickerChange', {
        id: this.info.id,
        value,
        index
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
    },
    onDateConfirm (value) {
      this.$emit('change', {
        type: 'dateSelect',
        id: this.info.id,
        value
      })
      this.showDatePicker = false
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
  &.not-edit-item {
    background-color: #fafafa !important;
    /deep/ .van-cell {
      background-color: #fafafa !important;
    }
  }
  /deep/ .van-cell {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: .1rem .06rem;
    box-sizing: border-box;
    .van-field__label {
      color: #646566;
      font-size: .14rem;
      width: auto;
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
}
/deep/ .van-field__value {
  .van-field__control--right {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .van-field__error-message {
    text-align: right;
  }
}
</style>
