import Vue from 'vue'
import App from './App.vue'
import "./config/bootstrap"
import "./config/msgs"

import store from "./config/store"
import router from "./config/router"
import moment from 'moment'

Vue.config.productionTip = false

/* Função global para exibir mascara de dinheiro  */
Vue.filter('maskDinheiro', (vlr, exibirRS = true) => {
  if (!Number(vlr)) return 'R$ 0,00'
  const valor = Number(vlr)
    .toFixed(2)
    .replace(".", ",")
    /* se retirar esse comentario da erro no js */
    //eslint-disable-next-line 
    .replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
  if (exibirRS) return `R$ ${valor}`; /* Exibir com  o simbolo R$ */
  return `${valor}`; /* Exibir sem simbolo R$ */
})

/* Função global para exibir horario formatado  */
Vue.filter('maskDataDataHora', (date) => {
  if (!date) return ''
  return moment(date, "YYYY-MM-DD hh:mm").format("DD/MM/YYYY HH:mm");
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
