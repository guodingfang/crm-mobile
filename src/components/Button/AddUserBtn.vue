<template>
  <div class="btn" @click="onClickBtn">
    <div class="add-user">
      <svg-icon name="add" class="add-icon"></svg-icon>
      <span class="btn-text">添加联系人</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddUserBtn',
  methods: {
    onClickBtn () {
      this.$emit('btn')
    }
  }
}
</script>

<style scoped lang="less">
.btn {
  height: .3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid @linkColor;
  background: @cardBg;
  margin: .12rem;
  border-radius: .06rem;
  .add-user {
    font-size: .12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @linkColor;
    .btn-text {
      margin-left: .06rem;
    }
  }
}
</style>
