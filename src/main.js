/* eslint-disable prettier/prettier */
import Vue from 'vue'
import App from './App.vue'
import VueTour from 'vue-tour'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ToggleButton from 'vue-js-toggle-button'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

require('vue-tour/dist/vue-tour.css')

Vue.use(VueTour)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ToggleButton)

new Vue({
  el: '#app',
  render: h => h(App)
})
