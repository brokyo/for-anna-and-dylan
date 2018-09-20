import Vue from 'vue';
import App from './App.vue';
import router from './router'

// Plugins
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

export const eventBus = new Vue();

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
