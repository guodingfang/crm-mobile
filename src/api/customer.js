import axios from '../utils/request'

/**
 * 获取客户列表、详情
 * @param option
 * @returns {AxiosPromise}
 */
export const getCustomerList = (option) => {
  return axios.get('/customer/queryCustomer', {
    params: {
      ...option
    }
  })
}

/**
 * 客户信息报备
 * @param option
 * @returns {AxiosPromise}
 */
export const createCustomer = (option) => {
  return axios.post('/customer/create', {
    ...option
  })
}

/**
 * 删除客户信息
 * @param option
 * @returns {AxiosPromise}
 */
export const deleteCustomer = (option) => {
  return axios.get('/customer/delete', {
    params: {
      ...option
    }
  })
}

/**
 * 客户更新
 * @param option
 * @returns {AxiosPromise}
 */
export const updateCustomer = (option) => {
  return axios.post('/customer/update', {
    ...option
  })
}

/**
 * 驳回后再次提交
 * @param option
 * @returns {AxiosPromise}
 */
export const resetCustomer = (option) => {
  return axios.post('/customer/resetCustomer', {
    ...option
  })
}

/**
 * 单独添加或者修改联系人
 * @param option
 * @returns {AxiosPromise}
 */
export const addContacts = (option) => {
  return axios.post('/customerLiaison/addLiaison', {
    ...option
  })
}
