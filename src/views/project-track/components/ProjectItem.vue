<template>
  <div class="item-container">
    <SwipeCell ref="swipe">
      <Skeleton
        title
        :row="2"
        :loading="!info"
      >
        <div class="item" :class="{'item-top': info.star === '1'}" v-if="info" @click="onSkipProject">
          <div class="header">
            <div class="code">
              <div class="label">项目编号：</div>
              <div class="val">{{ info.projectCode || '' }}</div>
            </div>
            <div class="status" v-if="info.sqztname">{{ info.sqztname || '' }}</div>
          </div>
          <div class="content">
            <div class="name">
              <div class="label">项目名称：</div>
              <div class="val">{{ info.projectName }}</div>
            </div>
            <div class="client">
              <div class="label">客户名称：</div>
              <div class="val">{{ info.clientName || '' }}</div>
            </div>
            <div class="manager">{{ info.clientManager }}</div>
          </div>
          <div class="footer">
            <div class="last-date">最后填写日期：</div>
            <div class="last-rate">最新赢率{{ info.yjqdl }}%</div>
          </div>
        </div>
      </Skeleton>
      <template #right>
        <div class="top-btn" v-if="info" @click.stop="onTop()">
          {{info.star === '1' ? '取消置顶' : '置顶'}}
        </div>
      </template>
    </SwipeCell>
  </div>
</template>

<script>
import { Skeleton, SwipeCell } from 'vant'
export default {
  name: 'Item',
  components: {
    Skeleton,
    SwipeCell
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  methods: {
    onSkipProject () {
      this.$emit('skip')
    },
    onTop () {
      this.$emit('top', {
        id: this.info.projectId,
        star: this.info.star === '1' ? '0' : '1'
      })
      this.$refs.swipe.close()
    }
  }
}
</script>

<style scoped lang="less">
.item {
  position: relative;
  display: flex;
  flex-direction: column;
  color: @titleColor;
  font-size: .12rem;
  background: @cardBg;
  padding: .12rem;
  margin-bottom: .06rem;
  border-radius: .06rem;
  overflow: hidden;
  &.item-top {
    border-top-left-radius: 0;
  }
  &.item-top:after {
    content: '';
    position: absolute;
    width: .36rem;
    height: .16rem;
    top: -.06rem;
    left: -.18rem;
    transform: rotate(-45deg);
    background-color: rgb(0, 150, 136);
  }
  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: .12rem;
    .code {
      display: flex;
    }
    .status {
      position: absolute;
      right: 0;
      .labelStyle()
    }
  }
  .content {
    margin-bottom: .1rem;
    position: relative;
    .name, .client {
      display: flex;
      .val {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: .42rem;
      }
    }
    .name {
      margin-bottom: .12rem;
    }
    .manager {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: .12rem;
      color: @textColor;
    }
  }
  .footer {
    padding-top: .12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid @pageBgColor;
    font-size: .1rem;
    color: @textColor;
  }
}
.top-btn {
  min-width: 100%;
  width: .6rem;
  height: 100%;
  background-color: rgb(0, 150, 136);
  color: @whiteColor;
  font-size: .12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/ .van-button {
    height: 100%;
  }
}
</style>
