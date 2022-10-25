import axios from '@/utils/request'
/**
 * 根据projectId获取竞争对手list
 * @param option
 * @returns {AxiosPromise}
 */
export const getCompetitorList = (option) => {
  return axios.get('/competitor/getByProject', {
    params: {
      ...option
    }
  })
}

/**
 * 根据name搜索竞争对手list
 * @param option
 * @returns {AxiosPromise}
 */
export const getSearchCompetitorList = (option) => {
  return axios.get('/competitor/queryByName', {
    params: {
      ...option
    }
  })
}

/**
 * 关联竞争对手到项目
 * @param option
 * @returns {AxiosPromise}
 */
export const mappingCompetitor = ({ projectId, competitorIds }) => {
  return axios.post(`/competitor/mapping/multi?projectId=${projectId}&competitorIds=${competitorIds}`, {})
}

/**
 * 删除进展对手项目关联
 * @returns {AxiosPromise}
 */
export const delMappingCompetitor = (option) => {
  return axios.get('/competitor/mapping/delete', {
    params: {
      ...option
    }
  })
}
