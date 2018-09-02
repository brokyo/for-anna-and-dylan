import Vue from 'vue'
import Router from 'vue-router'
import Full from './views/Full.vue'
import Setup from './views/Setup.vue'
import Start from './views/Start.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start
    },
    {
      path: '/setup',
      name: 'setup',
      component: Setup
    },
    {
      path: '/full',
      name: 'Full',
      component: Full
    }
  ]
  
})
