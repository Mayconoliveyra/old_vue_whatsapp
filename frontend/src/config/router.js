import Vue from "vue"
import VueRouter from "vue-router"

import Autenticacao from "../components/auth/Autenticacao"
import AutenticacaoWhatsapp from "../components/auth/AutenticacaoWhatsapp"
import Home from "@/components/home/Home"

import Clientes from "../components/pages/clientes/Clientes"
import Atendentes from "../components/pages/atendentes/Atendentes"
import PerfilPermissoes from "../components/pages/atendentes/PerfilPermissoes"

import WppCampanha from "../components/pages/whatsapp/WppCampanha"

import Empresas from "../components/pages/atendentes/Empresas"

import axios from "axios"
import { baseApiUrl } from "../../global"

import store from './store'

Vue.use(VueRouter)

const routes = [
    {
        name: "autenticacao",
        path: "/autenticacao",
        component: Autenticacao
    },
    {
        name: "autenticacao-whatsapp",
        path: "/autenticacao-whatsapp",
        component: AutenticacaoWhatsapp
    },
    {
        name: "home",
        path: "/",
        component: Home,
        meta: { requiresAutenticado: true }
    },
    {
        name: "clientes",
        path: "/clientes",
        component: Clientes,
        meta: { requiresAutenticado: true }
    },
    {
        name: "atendentes",
        path: "/atendentes",
        component: Atendentes,
        meta: { requiresAutenticado: true }
    },
    {
        name: "perfil-permissoes",
        path: "/perfil-permissoes",
        component: PerfilPermissoes,
        meta: { requiresAutenticado: true }
    },
    {
        name: "whatsapp-campanha",
        path: "/whatsapp-campanha",
        component: WppCampanha,
        meta: { requiresAutenticado: true }
    },

    {
        name: "empresas",
        path: "/empresas",
        component: Empresas,
        meta: { requiresAutenticado: true }
    }
]


const router = new VueRouter({
    mode: "history",
    routes,
})



// REGRAS DE ROUTER (RESTRIÇÕES)
//essa funcão recebe varios paramentros: to= para onde eu vou, from= de onde estou vindo, next= para onde vou
router.beforeEach(async (to, from, next) => {
    // VALIDA SE O USUARIO ESTÁ LOGADO.
    if (to.matched.some(record => record.meta.requiresAutenticado)) {
        /* Verifica se os dados do usuario estão setados, se nao tiver manda pra a tela de autenticação */
        if (store.state.dataAutenticacao.codigo_atendente && store.state.dataAutenticacao.nome_atendente && store.state.dataAutenticacao.senha) {
            const modeloLogin = {
                nome_atendente: store.state.dataAutenticacao.nome_atendente,
                senha: store.state.dataAutenticacao.senha,
            };

            axios
                .post(`${baseApiUrl}/autenticacao-status`, modeloLogin)
                .then((res) => {
                    console.log("STATUS: " + res.data.status_atual);
                    store.state.dataAutenticacao = res.data
                    if (res.data.status_atual == 'CONNECTED') {
                        next()
                    } else {
                        next({ path: "/autenticacao-whatsapp" })
                    }
                })
                .catch(() => {
                    /* se der algum erro envia pra a tela de login */
                    store.state.dataAutenticacao = {}
                    next({ path: "/autenticacao" })
                }
                )
        } else {
            /* reseta e manda pra a tela de login */
            store.state.dataAutenticacao = {}
            next({ path: "/autenticacao" })
        }
    } else {
        next()
    }
})
export default router