import { getLocation } from '@/api/user'

export default {
  data () {
    return {
      longitude: '116.481488',
      latitude: '39.990464',
      location: ''
    }
  },
  methods: {
    async getLocation () {
      const u = navigator.userAgent
      const isiOS = u.indexOf('Mobile Rockontrol') > -1
      const paramsJson = JSON.stringify({
        method: 'gpsLocation'
      })
      // 判断是否是 android
      if (window.android) {
        const setLocation = (data) => {
          const location = data
          this.location = location
          this.locationParse(location)
        }
        window.setLocation = setLocation
        window.android.onJsCallJava(paramsJson)
      } else if (isiOS) {
        const setLocation = (data) => {
          const location = data
          this.location = location
          this.locationParse(location)
        }
        window.setLocation = setLocation
        window.webkit.messageHandlers.onJsCallJava.postMessage(paramsJson)
      } else {
        await this.locationParse({
          lng: this.longitude,
          lat: this.latitude
        })
      }
    },
    async locationParse (location) {
      const { lat, lng } = typeof location === 'string' ? JSON.parse(location) : location || {}
      const data = await getLocation({
        key: 'd62f595552a9afb894e46d2247e09a27',
        location: `${lng},${lat}`
      })
      const {
        regeocode: {
          formatted_address: address
        }
      } = data
      this.address = address
      this.isLocation = true
    }
  }
}
