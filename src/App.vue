<template>
  <div id="app">
    <Header ref="header" />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { mapActions } from 'vuex'
export default {
  components: {
    Header
  },
  computed: {},
  mounted () {
    const height = this.$refs.header.$el.clientHeight
    this.setHeaderHeight(`${height}px`)
  },
  methods: {
    ...mapActions('util', ['setHeaderHeight'])
  }
}
</script>

<style lang="less" scoped>

</style>
