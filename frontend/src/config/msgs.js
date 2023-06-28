import Vue from "vue"
import Toasted from "vue-toasted"


Vue.use(Toasted, {
    duration: 3000
})

Vue.toasted.register(
    "defaultError",
    payload => !payload.msg ? "Oops... Erro inesperado." : payload.msg,
    {
        type: "error", position: "top-center", action: {
            text: 'X',
            onClick: (e, toastObject) => {
                toastObject.goAway(0);
            }
        }, className: ['msgDefultErroToasted']
    }
)
Vue.toasted.register(
    "defaultSuccess",
    payload => !payload.msg ? "Operação realizada com sucesso!" : payload.msg,
    {
        type: "success", position: "top-center", action: {
            text: 'X',
            onClick: (e, toastObject) => {
                toastObject.goAway(0);
            }
        }, className: ['msgDefultSucessoToasted']
    }
)


