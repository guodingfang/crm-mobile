import axios from '../utils/request'

// 获取用户基本信息
export const getUserBaseInfo = (option) => {
  return axios.get(`${window.crmPrefix}/userinfo`, {
    ...option
  }, {
    baseURL: '/'
  })
}

/**
 * 获取用户信息接口
 * @param code 用户code
 * @returns {AxiosPromise}
 */
export const getUserInfo = ({ code }) => {
  return axios.get('/user/query', {
    params: {
      code
    }
  })
}

export const getLocation = (option) => {
  return axios.get('/v3/geocode/regeo', {
    params: {
      ...option
    }
  }, {
    baseURL: 'https://restapi.amap.com',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

/**
 * 打卡
 * @param option
 * @returns {AxiosPromise}
 */
export const addClockRecord = (option) => {
  return axios.post('/position/addPosition', {
    ...option
  })
}

/**
 * 获取今天的打卡数量
 * @returns {AxiosPromise}
 */
export const getCurrentClockAmount = () => {
  return axios.get('/position/queryPositonCount', {})
}

/**
 * 查询打卡记录和数量
 * @returns {AxiosPromise}
 */
export const queryClockRecord = (option) => {
  return axios.get('/position/query', {
    params: {
      ...option
    }
  })
}

/**
 * 查询打卡记录和数量
 * @returns {AxiosPromise}
 */
export const judgeClockIsEdit = (id) => {
  return axios.get('/position/isCanEdit', {
    params: {
      id
    }
  })
}
