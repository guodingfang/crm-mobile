import axios from '@/utils/request'

/**
 * 新增拜访记录
 * @param option
 * @returns {AxiosPromise}
 */
export const addVisitRecord = (option) => {
  return axios.post('/visitLog/addVisit', {
    ...option
  })
}

/**
 * 客户拜访记录查询
 * @param id
 * @returns {AxiosPromise}
 */
export const queryCustomerVisitDetails = (id) => {
  return axios.get('/visitLog/queryCustomerVisit', {
    params: {
      id
    }
  })
}

/**
 * 客户经理拜访记录查询
 * @param id
 * @returns {AxiosPromise}
 */
export const queryManageVisitCustomerDetails = (id) => {
  return axios.get('/visitLog/queryVisit', {
    params: {
      id
    }
  })
}

/**
 * 客户经理拜访记录查询-查询客户所有的拜访记录
 * @param option
 * @returns {AxiosPromise}
 */
export const queryCustomerVisitManage = (option) => {
  return axios.get('/visitLog/queryAllVisit', {
    params: {
      ...option
    }
  })
}
