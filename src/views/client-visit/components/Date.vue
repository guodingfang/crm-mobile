<template>
  <div class="date-container">
    <vue-ellipse-progress
      :progress="progress"
      :no-data="noData"
      :empty-color="emptyColor"
      v-bind = "option"
    >
      <div @touchstart="onTouchstart" @touchend="onTouchend">
        <div class="date-model" :class="{'not-date-model': !this.allowClick}">
          <span class="date-val">{{ date }}</span>
          <span class="date-explain">第{{ clockAmount }}次打卡</span>
        </div>
      </div>
    </vue-ellipse-progress>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { Toast } from 'vant'
export default {
  name: 'Date',
  props: {
    clockAmount: {
      type: Number,
      default: 0
    },
    isLocation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: '',
      timer: null,
      timerClick: null,
      allowClick: true,
      progress: 0,
      noData: true,
      emptyColor: '#d9a56d',
      option: {
        mode: 'normal',
        size: 120,
        color: '#FFA847',
        animation: 'default 500 0'
      }
    }
  },
  mounted () {
    this.changeDate()
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.timerClick) {
      clearInterval(this.timerClick)
      this.timerClick = null
    }
  },
  methods: {
    changeDate () {
      this.date = dayjs().format('HH:mm:ss')
      this.timer = setInterval(() => {
        this.date = dayjs().format('HH:mm:ss')
      }, 1000)
    },
    onTouchstart () {
      if (!this.isLocation) {
        Toast('定位中不可打卡')
        return
      }
      if (!this.allowClick) {
        Toast('15s内不可重复打卡')
        return
      }
      this.noData = false
      this.progress = 100
      this.timerClick = setTimeout(() => {
        setTimeout(() => {
          this.allowClick = true
          this.emptyColor = '#d9a56d'
        }, 15000)
        this.emptyColor = '#999999'
        this.allowClick = false
        this.$emit('clock')
      }, 500)
    },
    onTouchend () {
      clearInterval(this.timerClick)
      this.timerClick = null
      this.noData = true
      this.progress = 0
    }
  }
}
</script>

<style scoped lang="less">
.date-container {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /deep/ .ep-hidden {
    opacity: 1;
  }
  .date-model {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    &.not-date-model {
      border-color: @textColor;
    }
    .date-val {
      font-size: .16rem;
      font-weight: bold;
      margin-bottom: .08rem;
      color: @titleColor;
    }
    .date-explain {
      font-size: .12rem;
      color: @textColor;
    }
  }
}
</style>
