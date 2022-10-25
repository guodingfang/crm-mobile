import axios from '@/utils/request'

/**
 * 获取跟踪的项目列表
 * @param option
 * @returns {AxiosPromise}
 */
export const getProject = (option) => {
  return axios.get('/projects/page4Mobile', {
    params: {
      ...option
    }
  })
}

/**
 * 获取跟踪的项目数量
 * @param option
 * @returns {AxiosPromise}
 */
export const getProjectCount = (option = {}) => {
  return axios.get('/projects/page4MobileCount', {
    params: {
      ...option
    }
  })
}

/**
 * 根据项目id获取项目周报
 * @param option
 * @returns {AxiosPromise}
 */
export const getProjectWeekList = (option) => {
  return axios.get('/project/weekly/page', {
    params: {
      ...option
    }
  })
}

/**
 * 获取周报默认数据
 * @param option
 * @returns {*}
 */
export const getWeekInit = (option) => {
  return axios.get('/project/weekly/new', {
    params: {
      ...option
    }
  })
}

/**
 * 根据周报id获取周报详情
 * @param option
 * @returns {AxiosPromise}
 */
export const getWeekDetails = (option) => {
  return axios.get('/project/weekly/get', {
    params: {
      ...option
    }
  })
}

/**
 * 保存周报信息
 * @param option
 * @returns {AxiosPromise}
 */
export const saveWeekInfo = (option) => {
  return axios.post('/project/weekly/save', {
    ...option
  })
}

/**
 * 根据项目id获取当期周是否已经填写周报
 * @param projectId
 * @returns {AxiosPromise}
 */
export const hasWeekly = ({ projectId }) => {
  return axios.post(`/project/weekly/hasWeekly?projectId=${projectId}`, {})
}

/**
 * 设置项目星标
 * @param option
 * @returns {AxiosPromise}
 */
export const setProWeekReportStar = (option) => {
  return axios.post('/customerStar/setProWeekReportStar', {
    ...option
  })
}
