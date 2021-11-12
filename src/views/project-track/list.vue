<template>
  <div class="container">
    <Title class="title" title="每周进展列表" />
    <div class="list">
      <Item />
    </div>
    <Footer
      :btn-list="btnList"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import Title from '@/components/Title'
import Item from './components/TrackItem'
import Footer from '@/components/Footer'
export default {
  name: 'trackList',
  components: {
    Title,
    Item,
    Footer
  },
  data () {
    return {
      btnList: [
        { status: 'btn1', name: '创建跟踪', type: 'confirm' }
      ]
    }
  },
  methods: {
    onConfirm () {
      this.$router.push({ path: '/projectTrack/details' })
    }
  }
}
</script>

<style scoped lang="less">
.title {
  padding: 0 .12rem;
}
.list {
  padding: 0 .12rem;
}
</style>
