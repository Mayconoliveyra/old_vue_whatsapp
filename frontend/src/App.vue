<template>
  <div class="app">
    <Menu />
    <Autenticacao v-if="!dataAutenticacao.codigo_atendente" />
    <Content v-else />
  </div>
</template>

<script>
import Menu from "./components/template/Menu";
import Content from "./components/template/Content";
import Autenticacao from "./components/auth/Autenticacao";
import { mapState } from "vuex";

export default {
  name: "App",
  components: { Menu, Autenticacao, Content },
  computed: mapState(["dataAutenticacao"]),
};
</script>

<style>
* {
  font-family: Poppins, sans-serif;
  font-weight: normal;
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 63px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "menu"
    "content";
}
.bloq-selec-text {
  -webkit-touch-callout: none; /* iPhone OS, Safari */
  -webkit-user-select: none; /* Chrome, Safari 3 */
  -khtml-user-select: none; /* Safari 2 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
}
.msgDefultErroToasted {
  color: rgb(255, 255, 255) !important;
  background-color: rgb(232, 87, 66) !important;
  padding: 15px 0px 15px 20px !important;
  border-radius: 4px !important;

  border: 1px solid rgb(223, 223, 223) !important;
  box-sizing: border-box !important;
  box-shadow: rgb(0 0 0 / 25%) 0px 2px 4px !important;
}
.msgDefultSucessoToasted {
  color: rgb(255, 255, 255) !important;
  background-color: rgb(114, 160, 118) !important;
  padding: 15px 0px 15px 20px !important;
  border-radius: 4px !important;

  border: 1px solid rgb(223, 223, 223) !important;
  box-sizing: border-box !important;
  box-shadow: rgb(0 0 0 / 25%) 0px 2px 4px !important;
}
.toasted-container {
  top: -10px !important;
  /* right: 0px !important; */
}
.action {
  color: rgb(89, 88, 88) !important;
  padding: 5px 12px 5px 10px !important;
  margin: 0px !important;
  font-size: 21px !important;
}
.desabilitado {
  color: #6c757d !important;
  background-color: #e9ecef !important;
  cursor: not-allowed !important;
}
.form-cadastro {
  padding: 15px 25px;
  margin: 15px;
  border: #cccccc solid 1px;
  border-radius: 3px;
  background: #ffffff;
  color: #504f4f;
}
.form-cadastro legend {
  font-weight: bold;
  font-size: 13px;
  padding: 3px;
  overflow: hidden !important;
  white-space: nowrap !important;
}
.row > div {
  margin: 0px !important;
  padding: 0px 4px !important;
}
.form-cadastro input,
select {
  height: 34px !important;
  padding: 6px 12px !important;
  font-size: 14px !important;
}
button,
select,
input:active {
  outline-style: none !important;
  box-shadow: 0 0 0 0 !important;
  outline: 0 !important;
  border: 1px solid #ced4da !important;
}
button,
select,
input:focus {
  outline-style: none !important;
  box-shadow: 0 0 0 0 !important;
  outline: 0 !important;
  border: 1px solid #ced4da !important;
}
/* Form input desabilitado para exibir informações */
.input-exibir {
  background-color: #e9ecef;
  height: 34px !important;
  padding: 6px 12px !important;
  font-size: 14px !important;
  border-radius: 0.2rem;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  overflow: hidden;
}
</style>
