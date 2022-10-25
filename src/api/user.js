import axios from '../utils/request'

// 获取用户基本信息
export const getUserBaseInfo = (option) => {
  return axios.get(`${window.crmPrefix}/userinfo`, {
    ...option
  }, {
    baseURL: '/'
  })
}

// 退出
export const logout = (option) => {
  return axios.get(`${window.crmPrefix}/logout`, {
    ...option
  }, {
    baseURL: '/'
  })
}

// 获取用户头像
export const getUserAvatar = (option) => {
  return axios.get(`${window.crmPrefix}/Services/avater`, {
    params: {
      ...option
    }
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

/**
 * 获取用户权限
 * @param code
 * @returns {AxiosPromise}
 */
export const getRoles = ({ code }) => {
  return axios.get('user/getRoleByCode', {
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
 * 删除打卡记录
 * @param id
 * @returns {*}
 */
export const delClockRecord = (id) => {
  return axios.get('/position/removePosition', {
    params: {
      id
    }
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
 * 判断拜访记录是否可以编辑
 * @returns {AxiosPromise}
 */
export const judgeClockIsEdit = (id) => {
  return axios.get('/position/isCanEdit', {
    params: {
      id
    }
  })
}

/**
 * 统计自己和下属的打卡记录
 * @returns {AxiosPromise}
 */
export const getVisitCount = () => {
  return axios.get('/position/visitCount', {})
}
