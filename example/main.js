/*
 * @Descripttion: 
 * @version: 
 * @Author: Jianyong Wang
 * @Date: 2020-06-04 12:18:43
 * @LastEditors: Jianyong Wang
 * @LastEditTime: 2022-05-12 15:22:56
 */ 
import Vue from 'vue'
import App from './App.vue'

import './styles/reset.css'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
