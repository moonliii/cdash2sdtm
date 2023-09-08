import config from './config'
import confirmDomain from './confirmDomain'
import varSetting from './varSetting'
import define from './define'

class API {
  constructor() {
    this.config = config
    this.confirmDomain = confirmDomain
    this.varSetting = varSetting
    this.define = define
  }
}

export default new API()