<template>
  <div class="item" @click="onSkipDetails">
    <div class="header">
      <div class="location">
        <svg-icon class="icon" name="location" />
        <span>{{ info.location }}</span>
      </div>
      <Tag :color="tagColor">{{ info.status === '0' ? '未填写' : '已填写' }}</Tag>
    </div>
    <div class="content">
      备注：{{ info.notes }}
    </div>
    <div class="footer">
      <div class="date">
        {{ info.positionTime }}
      </div>
    </div>
    <template v-if="info.managerName !== userInfo.name">
      <div class="manager">{{ info.managerName }}</div>
    </template>
    <template v-else>
      <div class="del" v-if="info.status === '0'">
        <svg-icon name="del" @click.stop="onDel"></svg-icon>
      </div>
    </template>
  </div>
</template>

<script>
import { Tag, Dialog } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'Item',
  components: {
    Tag
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    tagColor () {
      return this.info.status === '0' ? '#96e0d5' : '#facd91'
    }
  },
  methods: {
    onSkipDetails () {
      if (this.info.managerName !== this.userInfo.name) {
        if (this.info.status !== '0') {
          this.$emit('skip', {
            info: this.info
          })
        }
      } else {
        this.$emit('skip', {
          info: this.info
        })
      }
    },
    onDel () {
      Dialog.confirm({
        message: '是否删除该打卡记录'
      }).then(() => {
        this.$emit('del', {
          info: this.info
        })
        // on confirm
      }).catch(() => {
        // on cancel
      })
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
  background-color: @whiteColor;
  margin-bottom: 0.06rem;
  .header {
    display: flex;
    justify-content: space-between;
    .location {
      flex: 1;
      .single-row-overstep();
      .icon {
        color: @linkColor;
      }
    }
    .purpose {
      margin-right: auto;
    }
  }
  .content {
    font-size: .12rem;
    padding: .12rem 0;
  }
  .footer {
    .date {
      color: @textColor;
    }
  }
  .del, .manager {
    position: absolute;
    right: 0;
    bottom: 0;
    color: @textColor;
    padding: .06rem .12rem;
  }
  .manager {
    color: @tipsColor;
    font-size: .12rem;
  }
}
</style>
