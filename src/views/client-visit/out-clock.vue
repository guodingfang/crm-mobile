<template>
  <div class="container">
    <Tab currentTab="outClock"/>
    <div class="bg">
      <div class="header">
        <div class="user">你好，{{ userInfo.name }}</div>
        <div class="time">{{ time }}</div>
      </div>
      <div class="bg-mask"></div>
      <img class="bg-img" src="@/assets/location-bg.png" alt="">
    </div>

    <Address :address="address" @again="onAgainLocation" />

    <div class="model">
      <div class="notes">
        <Field
          v-model="notes"
          rows="2"
          autosize
          type="input"
          maxlength="50"
          placeholder="填写备注信息"
          show-word-limit
        />
      </div>
      <p class="explain">说明：打卡前请先点击定位，确认位置无误后点击下方的打卡按钮</p>
    </div>
    <div class="address-model">
      <Date :clock-amount="clockAmount" @clock="onClock" />
    </div>

  </div>
</template>

<script>
import { Field } from 'vant'
import Tab from '@/views/client-visit/components/Tab'
import Date from './components/Date'
import Address from '@/views/client-visit/components/Address'
import { addClockRecord, getCurrentClockAmount } from '@/api/user'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import location from './mixins/location'
export default {
  name: 'OutClock',
  mixins: [location],
  components: {
    Tab,
    Date,
    Field,
    Address
  },
  data () {
    return {
      time: '',
      clockAmount: 0,
      notes: '',
      address: '定位中...',
      location: '',
      weeks: ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    const time = `${moment().format('YYYY-MM-DD')}  (周${this.weeks[moment().isoWeekday() - 1]})`
    this.time = time
    this.getLocation()
    this.getCurrentClockAmount()
  },
  methods: {
    ...mapActions('visit', ['setUpdateRecord']),
    async getCurrentClockAmount () {
      const { code, data } = await getCurrentClockAmount()
      if (code !== 0) return
      this.clockAmount = data
    },
    onAgainLocation () {
      this.address = '定位中...'
      this.getLocation()
    },
    async onClock () {
      const { code } = await addClockRecord({
        createDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        creater: this.userInfo.name,
        managerCode: this.userInfo.code,
        managerName: this.userInfo.name,
        location: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
        positionDate: moment().format('YYYY-MM-DD'),
        positionTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: 0,
        notes: this.notes
      })
      if (code !== 0) return
      this.notes = ''
      this.clockAmount = this.clockAmount + 1
      this.setUpdateRecord(true)
    }
  }
}
</script>

<style scoped lang="less">
.container {
  background: @whiteColor;
  min-height: calc(100vh - .46rem);
}
.bg {
  position: relative;
  width: 100%;
  height: 2.2rem;
  z-index: 1;
  .bg-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(180deg, #ffffff, transparent, 100%, transparent);
  }
  .bg-img {
    height: 2.2rem;
    position: relative;
    z-index: -1;
    width: 100%;
  }
  .header {
    width: 100%;
    position: absolute;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .12rem;
    box-sizing: border-box;
    .user {
      font-size: .14rem;
      color: @titleColor;
      font-weight: bold;
    }
    .time {
      font-size: .12rem;
      color: @titleColor;
    }
  }
}
.model {
  //margin-top: -.24rem;
  padding: .24rem .24rem .12rem .24rem;
  box-sizing: border-box;
  .notes {
    /deep/ .van-cell {
      flex-direction: column;
      padding: 0;
      .van-field__value {
        padding: .04rem .12rem;
        border: 1px solid #e5e5e5;
        border-radius: .06rem;
      }
    }
  }
  .explain {
    font-size: .12rem;
    color: @textColor;
    margin: .12rem;
  }

  &.address-model {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
