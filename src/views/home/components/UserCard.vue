<template>
  <div class="container">
    <Skeleton
      title
      avatar
      :row="3"
      avatar-size="56"
      :loading="!userInfo"
    >
      <div class="user" v-if="userInfo">
        <dl class="info">
          <dt>
            <h3 class="user-name">{{ userInfo.name }}</h3>
            <span class="job">{{ userInfo.job }}</span>
          </dt>
          <dd>
            <span class="label">事业集群：</span>
            <span class="val">{{ userInfo.group || '--' }}</span>
          </dd>
          <dd>
            <span class="label">中心：</span>
            <span class="val">{{ userInfo.center || '--' }}</span>
          </dd>
          <dd>
            <span class="label">部门：</span>
            <span class="val">{{ userInfo.dept || '--' }}</span>
          </dd>
        </dl>
        <div class="head-portrait">
          <img :src="avatar" alt="">
          <!--      <span>发送名片</span>-->
        </div>
      </div>
    </Skeleton>
  </div>
</template>

<script>
import { Skeleton } from 'vant'
export default {
  name: 'UserCard',
  components: {
    Skeleton
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  computed: {
    avatar () {
      return this.userInfo.avatar || require('@/assets/default-head.png')
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: @whiteColor;
  margin: 0.12rem;
  border-radius: 0.06rem;
  padding: 0.12rem;
  /deep/ .van-skeleton {
    flex-direction: row-reverse;
    padding: 0;
    .van-skeleton__avatar {
      margin-right: 0;
    }
  }
}
.user {
  display: flex;
  .info {
    display: flex;
    flex-direction: column;
    dt {
      display: flex;
      height: .36rem;
      align-items: center;
      color: @titleColor;
      .user-name {
        font-size: .16rem;
        margin: 0;
      }
      .job {
        margin-left: .16rem;
        .labelStyle()
      }
    }
    dd {
      height: .26rem;
      display: flex;
      align-items: center;
      color: @titleColor;
      .label {
        font-size: .12rem;
      }
      .val {
        font-size: .12rem;
      }
    }
  }
  .head-portrait {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: .56rem;
      height: .56rem;
      border-radius: 50%;
    }
    span {
      margin-top: .16rem;
      color: @linkColor;
      font-size: .12rem;
    }
  }
}
</style>
