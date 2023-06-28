import Vue from "vue"

export const usuarioChave = "__usuario_login"
export const baseApiUrl = "http://localhost:3030"
/* export const baseApiUrl = "http://192.168.1.17:3030" */

export function showError(e) {
    if (e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg: e.response.data, duration: 5000 })
    } else if (typeof e === "string") {
        Vue.toasted.global.defaultError({ msg: e, duration: 5000 })
    } else {
        Vue.toasted.global.defaultError() /* mensagem do msg sera invocada */
    }
}

export function showSucesso(e) {
    if (e && e.response && e.response.data) {
        Vue.toasted.global.defaultSuccess({ msg: e.response.data, duration: 9000 })
    } else if (typeof e === "string") {
        Vue.toasted.global.defaultSuccess({ msg: e, duration: 9000 })
    } else {
        Vue.toasted.global.defaultSuccess() /* mensagem do msg sera invocada */
    }
}

export default { baseApiUrl, showError, showSucesso, usuarioChave } 
