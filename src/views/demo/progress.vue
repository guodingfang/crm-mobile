<template>
  <div>
    <vue-ellipse-progress
      :progress="progress"
      v-bind = "option"
    >
      <div
        @touchstart="onTouchstart"
        @touchend="onTouchend"
      >
        <div class="date-model" :class="{'not-date-model': !this.allowClick}">
          <span class="date-val">11:49:58</span>
          <span class="date-explain">第2次打卡</span>
        </div>
      </div>
    </vue-ellipse-progress>
    <div @click="onNot">清空</div>
  </div>
</template>

<script>
export default {
  name: 'DemoProgress',
  data () {
    return {
      allowClick: true,
      progress: 0,
      option: {
        mode: 'normal',
        size: 120,
        color: '#FFA847',
        // colorFill: '#fff',
        emptyColor: '#d9a56d',
        animation: 'default 2500 0',
        noData: true
      }
    }
  },
  methods: {
    onNot () {
      this.option = {
        ...this.option,
        noData: !this.option.noData
      }
    },
    onTouchstart () {
      this.option = {
        ...this.option,
        noData: false
      }
      this.progress = 100
      this.timerClick = setTimeout(() => {
        setTimeout(() => {
          this.allowClick = true
        }, 15000)
        console.log('打卡成功')
      }, 2500)
    },
    onTouchend () {
      this.option = {
        ...this.option,
        noData: true
      }
      this.progress = 0
      clearInterval(this.timerClick)
      this.timerClick = null
    }
  }
}
</script>

<style scoped lang="less">
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
</style>
