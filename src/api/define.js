import axios from '@/utils/request'

const define = {

  downloadDefine: (data) => axios({
    url: '/define/downloadDefine',
    method: 'post',
    data,
  }),

}

export default define