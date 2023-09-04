import Vue from 'vue'
import VueRouter from 'vue-router'
import MainView from '../views/MainView.vue'
import ConfigView from '../views/ConfigView.vue'
import ConfirmDomainView from '../views/ConfirmDomainView.vue'
import VarSettingView from '../views/VarSettingView'

Vue.use(VueRouter)

const routes = [
  {
    path: '/mainView',
    name: 'MainView',
    redirect: '/config',
    component: MainView,
    children: [
      {
        path: '/config',
        name: 'config',
        component: ConfigView
      },
      {
        path: '/confirmDomain',
        name: 'confirmDomain',
        component: ConfirmDomainView
      },
      {
        path: '/varSetting',
        name: 'varSetting',
        component: VarSettingView
      }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})

export default router
