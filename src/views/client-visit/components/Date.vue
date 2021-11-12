<template>
  <div @click="onClock" @touchstart="onTouchstart" @touchend="onTouchend">
    <div class="date-model" :class="{'not-date-model': !this.allowClick}">
      <span class="date-val">{{ date }}</span>
      <span class="date-explain">第{{ clockAmount }}次打卡</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// eslint-disable-next-line no-unused-vars
import { Toast } from 'vant'
export default {
  name: 'Date',
  props: {
    clockAmount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      date: '',
      timer: null,
      timerClick: null,
      allowClick: true
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
      this.date = moment().format('HH:mm:ss')
      this.timer = setInterval(() => {
        this.date = moment().format('HH:mm:ss')
      }, 1000)
    },
    onTouchstart () {
      // this.timerClick = setTimeout(() => {
      //   setTimeout(() => {
      //     this.allowClick = true
      //   }, 15000)
      //   this.$emit('clock')
      // }, 2500)
    },
    onTouchend () {
      // clearInterval(this.timerClick)
      // this.timerClick = null
    },
    onClock () {
      if (this.allowClick) {
        this.allowClick = false
        setTimeout(() => {
          this.allowClick = true
        }, 15000)
        this.$emit('clock')
      } else {
        Toast('15s内不可重复打卡')
      }
    }
  }
}
</script>

<style scoped lang="less">
  .date-model {
    margin: auto;
    background-color: @whiteColor;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    box-shadow:  -10px 10px 20px rgba(0, 0, 0, .25),
      10px -10px 20px #ffffff;
    border: .05rem solid @yellowColor;
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
</style>
