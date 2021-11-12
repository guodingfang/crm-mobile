<template>
  <div class="header-container" :class="{'header-android': headerTop }" :style="{'--height--': headerTop}">
    <NavBar
      :title="headerTitle"
      left-arrow
      @click-left="onBack"
      fixed
      safe-area-inset-top
      z-index="999"
    />
    <div class="block-placeholder"></div>
  </div>
</template>

<script>
import { NavBar } from 'vant'
export default {
  name: 'Header',
  components: {
    NavBar
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headerTop: ''
    }
  },
  computed: {
    headerTitle () {
      return this.$route.meta.title || 'CRM系统'
    }
  },
  mounted () {
    if (window.android) {
      const top = window.android.getDeviceInfo ? JSON.parse(window.android.getDeviceInfo()).statusBarHeightDP : ''
      this.headerTop = top ? `${top}px` : '2.8vh'
    }
  },
  methods: {
    onBack () {
      if (this.$route.path === '/index') {
        if (window.android) {
          window.android.closeWebView()
        } else if (window.webkit) {
          window.webkit.messageHandlers.backApp.postMessage({})
        } else {
          console.log('无法返回')
        }
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped lang="less">
.header-container {
  /deep/ .block-placeholder {
    height: .46rem;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }
  /deep/ .van-nav-bar {
    background: @headerBg;
    .van-nav-bar__title {
      color: @whiteColor;
    }
    .van-nav-bar__left {
      .van-nav-bar__arrow {
        color: @whiteColor;
      }
    }
  }
  &.header-android {
    /deep/ .block-placeholder {
      margin-top: var(--height--);
    }
    /deep/ .van-nav-bar {
      padding-top: var(--height--);
    }
  }
}
</style>
