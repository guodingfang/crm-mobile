<template>
  <div class="list">
    <div
      class="item"
      v-for="(item) in list"
      :key="'item' + item.id"
      @click="onClickItem(item)"
    >
      {{ item.id }} - {{ item.amount }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      list: [
        {
          id: 1,
          amount: 99,
          pic: ''
        },
        {
          id: 2,
          amount: 89,
          pic: ''
        },
        {
          id: 3,
          amount: 59,
          pic: ''
        }
      ]
    }
  },
  mounted () {
    console.log('@', this.$route.params, this.id)
  },
  methods: {
    onClickItem (item) {
      item.amount += 1
    }
  }
}
</script>

<style scoped lang="less">
.list {
  display: flex;
  flex-direction: column;
  .item {
    height: 1rem;
    background-color: @whiteColor;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .item + .item {
    border-top: 1px solid #e5e5e5;
  }
}
</style>
