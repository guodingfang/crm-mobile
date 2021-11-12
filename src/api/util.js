import axios from '../utils/request'

// 获取客户类型
export const getCustomerCharacter = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'KHXZ'
    }
  })
}

// 获取客户类型
export const getCustomerType = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'CRM_CUSTOMER_TYPE'
    }
  })
}

// 获取省份/城市
export const getRegionInfo = (option) => {
  return axios.get('/region/query', {
    params: {
      ...option
    }
  })
}
