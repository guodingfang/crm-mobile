<template>
  <div class="item" @click="onSkipDetails">
    <div class="header">
      <div class="location">
        <svg-icon class="icon" name="location" />
        <span>{{ info.location }}</span>
      </div>
      <Tag plain :color="tagColor">{{ info.status === '0' ? '未填写' : '已填写' }}</Tag>
    </div>
    <div class="content">
      备注：{{ info.notes }}
    </div>
    <div class="footer">
      <div class="date">
        {{ info.positionTime }}
      </div>
    </div>
    <div class="del" v-if="info.status === '0'">
      <svg-icon name="del" @click.stop="onDel"></svg-icon>
    </div>
  </div>
</template>

<script>
import { Tag, Dialog } from 'vant'
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
    tagColor () {
      return this.info.status === '0' ? '#87E8DE' : '#91D5FF'
    }
  },
  methods: {
    onSkipDetails () {
      this.$emit('skip', {
        info: this.info
      })
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
  .del {
    position: absolute;
    right: 0;
    bottom: 0;
    color: @textColor;
    padding: .06rem .12rem;
  }
}
</style>
