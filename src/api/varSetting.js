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
  querySheetName: (data) => axios({
    url: '/varSetting/querySheetName',
    method: 'post',
    data
  }),
  queryField: (data) => axios({
    url: '/varSetting/queryField',
    method: 'post',
    data
  }),
  setVlm: (data) => axios({
    url: '/varSetting/setVlm',
    method: 'post',
    data
  }),
  queryCtInfo: (data) => axios({
    url: '/varSetting/queryCtInfo',
    method: 'post',
    data
  }),
  queryAllCtCode: (data) => axios({
    url: '/varSetting/queryAllCtCode',
    method: 'post',
    data
  }),
  queryCustomCT: (data) => axios({
    url: '/varSetting/queryCustomCT',
    method: 'post',
    data
  }),
  saveCustomCT: (data) => axios({
    url: '/varSetting/saveCustomCT',
    method: 'post',
    data
  }),
  deleteCustomCT: (data) => axios({
    url: '/varSetting/deleteCustomCT',
    method: 'post',
    data
  }),
  save: (data) => axios({
    url: '/varSetting/save',
    method: 'post',
    data
  })
}

export default varSetting