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

// 获取项目模式
export const getProjectModel = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'XMMS'
    }
  })
}

// 获取售前状态
export const getPreSaleStatus = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'SQZT_GZ'
    }
  })
}

// 获取联系人角色
export const getContactsRol = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'CRM_CONTACTS_ROL'
    }
  })
}

// 获取拜访类型
export const getVisiType = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'CRM_VISIT_TYPE'
    }
  })
}

// 获取产品线
export const getProductLine = () => {
  return axios.get('/dic/getDic', {
    params: {
      typeCode: 'CRM_PRODUCT_LINE'
    }
  })
}
