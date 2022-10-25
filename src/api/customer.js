import axios from '../utils/request'

// 查询企业信息
export const searchCustomer = (keywords) => {
  return axios.post(`/customer/queryByKey?keyword=${keywords}`)
}

// 根据天眼查获取企业详情
export const getDetails = (cid) => {
  // return axios.post(`/tyc/query/queryForCID?cid=${cid}`, null, {
  //   baseURL: 'https://szjh.rockontrol.com'
  // })
  return axios.post(`/customer/getByTyc?key=${cid}`)
}

export const getCustomerBuProductLine = (id) => {
  return axios.get('/manager/lineTypesByCustomer', {
    params: {
      customerId: id
    }
  })
}

/**
 * 获取客户列表
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
 * 获取客户数量
 * @param option
 * @returns {AxiosPromise}
 */
export const getCustomerCount = (option) => {
  return axios.get('/customer/countCustomers', {
    params: {
      ...option
    }
  })
}

/**
 * 根据关键字获取客户名称
 * @param option
 * @returns {AxiosPromise}
 */
export const getCustomerByName = (option) => {
  return axios.get('/cmInfo/queryCustomerByName', {
    params: {
      ...option
    }
  })
}

/**
 * 获取客户详情
 * @param option
 * @returns {AxiosPromise}
 */
export const getCustomerDetails = (option) => {
  return axios.get('/customer/get', {
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
 * 客户信息保存
 * @param option
 * @returns {AxiosPromise}
 */
export const saveCustomer = (option) => {
  return axios.post('/customer/save', {
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
 * 删除未提交客户报备信息
 * @param option
 * @returns {AxiosPromise}
 */
export const removeCustomer = (option) => {
  return axios.get('/customer/remove', {
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

/**
 * 获取客户列表
 * @param option
 * @returns {AxiosPromise}
 */
export const getContactsList = (customerId) => {
  return axios.get('/customerLiaison/queryLiaison/customer', {
    params: {
      customerId
    }
  })
}

/**
 * 给客户设置星标
 * @param option
 * @returns {AxiosPromise}
 */
export const setCusStar = (option) => {
  return axios.post('/customerStar/setCusStar', {
    ...option
  })
}
