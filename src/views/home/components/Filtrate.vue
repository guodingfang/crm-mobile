<template>
  <div class="filtrate" @click="selectTime">
    <span class="week" :class="{'select-time': type === 0}">本周</span>
    <span class="month" :class="{'select-time': type === 1}">本月</span>
  </div>
</template>

<script>
export default {
  name: 'Filtrate',
  components: {
  },
  data () {
    return {
      checked: true,
      // 0 - 周，1 - 月
      type: 0
    }
  },
  methods: {
    selectTime () {
      this.type = this.type === 0 ? 1 : 0
      this.$emit('select', this.type)
    }
  }
}
</script>

<style scoped lang="less">
.filtrate {
  display: inline-flex;
  height: .24rem;
  align-items: center;
  justify-content: center;
  border-radius: .06rem;
  background-color: @whiteColor;
  font-size: .12rem;
  overflow: hidden;
  span {
    height: 100%;
    width: .42rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &.select-time {
      background-color: rgb(25, 158, 216);
      color: @whiteColor;
    }
  }
}
</style>
