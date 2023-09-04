import config from './config'
import confirmDomain from './confirmDomain'
import varSetting from './varSetting'

class API {
  constructor() {
    this.config = config
    this.confirmDomain = confirmDomain
    this.varSetting = varSetting
  }
}

export default new API()