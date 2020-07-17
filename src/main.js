/* eslint-disable prettier/prettier */
import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import ToggleButton from 'vue-js-toggle-button'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ToggleButton)

new Vue({
  el: '#app',
  render: h => h(App)
})
