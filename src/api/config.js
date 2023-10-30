import axios from '@/utils/request'

const config = {
  // 上传文件
  upload: (data) => axios({
    url: '/config/upload',
    method: 'post',
    data,
    headers: { "Content-Type": "multipart/form-data" }
  }),

  // 上传原始数据集文件
  uploadDataset: (data) => axios({
    url: '/config/uploadDataset',
    method: 'post',
    data,
    headers: { "Content-Type": "multipart/form-data" }
  }),

  // 保存并继续
  save: (data) => axios({
    url: '/config/save',
    method: 'post',
    data
  }),

  // 查询所有SDTM-IG
  querySdtmig: () => axios({
    url: '/config/querySdtmig',
    method: 'post',
  }),

  // 查询所有queryCtVersion
  queryCtVersion: () => axios({
    url: '/config/queryCtVersion',
    method: 'post',
  }),

  // 查询所有queryDefineVersion
  queryDefineVersion: () => axios({
    url: '/config/queryDefineVersion',
    method: 'post',
  })

}

export default config