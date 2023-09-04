import axios from '@/utils/request'

const varSetting = {
  queryAllDomain: (data) => axios({
    url: '/varSetting/queryAllDomain',
    method: 'post',
    data
  }),
  queryAllVarInfo: (data) => axios({
    url: '/varSetting/queryAllVarInfo',
    method: 'post',
    data
  }),
  queryStandardVar: (data) => axios({
    url: '/varSetting/queryStandardVar',
    method: 'post',
    data
  }),
  queryVarInfo: (data) => axios({
    url: '/varSetting/queryVarInfo',
    method: 'post',
    data
  }),
  deleteVar: (data) => axios({
    url: '/varSetting/deleteVar',
    method: 'post',
    data
  }),
}

export default varSetting