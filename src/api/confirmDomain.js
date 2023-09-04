import axios from '@/utils/request'

const confirmDomain = {
  // 查询domainAllList(SDTM所有的域),domainInfoVoList(推荐的域及其相关信息列表)
  queryAllDomain: (data) => axios({
    url: '/confirmDomain/queryAllDomain',
    method: 'post',
    data
  }),

  // 获取该域的相关信息
  queryDomInfo: (data) => axios({
    url: '/confirmDomain/queryDomInfo',
    method: 'post',
    data
  }),

  // 删除域
  deleteDom: (data) => axios({
    url: '/confirmDomain/deleteDom',
    method: 'post',
    data
  }),
}

export default confirmDomain