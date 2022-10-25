<template>
  <div class="footer-container">
    <div class="footer">
      <div class="btn-container">
        <div
          class="btn"
          :class="btnStyle(btn.status)"
          v-for="btn in btnList"
          :key="btn.type"
          v-preventReClick
          @click="handleBtn(btn.type)"
        >
          {{ btn.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    btnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    isAllowClick: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    btnStyle (type) {
      return `${type}`
    },
    handleBtn (type) {
      if (!this.isAllowClick) return
      this.$emit('update:isAllowClick', false)
      this.$emit(type)
    }
  }
}
</script>

<style scoped lang="less">
.footer-container {
  padding-top: .12rem;
  height: .46rem;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .footer {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    height: .46rem;
    background: @cardBg;
    box-shadow: 0 0 .05rem #e5e5e5;
    display: flex;
    align-items: center;
    //padding: 0 .12rem;
    justify-content: space-around;
    .btn-container {
      flex: 1;
      //height: .32rem;
      height: 100%;
      //border-radius: .32rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &.btn1 {
          background: rgb(22, 155, 213);
          color: @whiteColor;
        }
        &.btn2 {
          background: #1ABC9C;
          color: @whiteColor;
        }
        &.btn3 {
          background: #EC808D;
          color: @whiteColor;
        }
      }
    }
  }
}
</style>
