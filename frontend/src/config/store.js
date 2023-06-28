import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"

Vue.use(Vuex)
export default new Vuex.Store({
        state: {
                dataAutenticacao: {}, /* codigo_atendente: null, nome_atendente: null, senha: null, id_perfil */
        },
        mutations: {
                setDataAutenticacao(state, data) {
                        state.dataAutenticacao = data
                        axios.defaults.headers.sessao = `${data.contato_empresa}`
                        axios.defaults.headers.empresa = `${data.nome_empresa}`
                },
        }
})
