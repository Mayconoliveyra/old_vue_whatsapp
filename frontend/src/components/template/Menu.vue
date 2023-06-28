<template>
  <aside
    class="menu bloq-selec-text"
    v-if="dataAutenticacao.nome_atendente && dataAutenticacao.codigo_atendente && dataAutenticacao.status_atual == 'CONNECTED'"
  >
    <div class="atendente-nome">
      <img
        v-if="dataAutenticacao.url_imagem"
        :src="dataAutenticacao.url_imagem"
        alt="imagem_display"
      />
      <b-icon v-else icon="person-circle" class="mr-2" scale="1.7"></b-icon>
      {{dataAutenticacao.nome_atendente }}
    </div>
    <router-link v-if="dataAutenticacao.cadastrar_campanhas" to="/whatsapp-campanha" href class="item-nav">
      <b-iconstack font-scale="1.6">
        <b-icon shift-v="4" shift-h="18" stacked icon="lightning" scale="0.7"></b-icon>
        <b-icon stacked icon="whatsapp"></b-icon>
      </b-iconstack>
    </router-link>
    <router-link v-if="dataAutenticacao.menu_clientes" to="/clientes" href class="item-nav">
      <b-iconstack font-scale="1.6">
        <b-icon shift-v="5" shift-h="15" stacked icon="list-ul" scale="0.7"></b-icon>
        <b-icon stacked icon="people"></b-icon>
      </b-iconstack>
    </router-link>
    <router-link v-if="dataAutenticacao.menu_atendentes" to="/atendentes" href class="item-nav">
      <b-iconstack font-scale="1.6">
        <b-icon shift-v="5" shift-h="16.5" stacked icon="gear" scale="0.66"></b-icon>
        <b-icon stacked icon="headset"></b-icon>
      </b-iconstack>
    </router-link>
    <!-- <router-link to="/configuracao" href class="item-nav">
      <b-icon icon="gear" scale="1.4"></b-icon>
    </router-link>-->
    <b @click="sair()" class="item-nav">
      <b-icon icon="arrow-bar-right" scale="1.4"></b-icon>
    </b>
  </aside>
  <aside class="menu" v-else>
    <router-link to="/autenticacao" class="nao-logado">GERENCIADOR WHATSAPP</router-link>
  </aside>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Menu",
  computed: mapState(["dataAutenticacao"]),
  methods: {
    sair() {
      this.$store.commit("setDataAutenticacao", {});
      this.$router.push({ name: "autenticacao" });
    },
  },
};
</script>

<style scoped>
.menu {
  grid-area: menu;
  display: flex;
  width: 100%;
  height: 100%;
  justify-items: end;
  justify-content: flex-end;
  color: #002060;
  background-color: rgb(247, 247, 247);
  padding: 12px;
  box-shadow: 0 3px 6px 0 rgb(0 0 0 / 16%);
}
.nao-logado {
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #002060;
}
.item-nav {
  border: solid 1px #898888;
  background-color: #ececec;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  margin-left: 10px;
  color: #002060;
}
.item-nav:hover {
  cursor: pointer;
}
.atendente-nome {
  font-size: 15px;
  flex: 1;
  font-weight: 700;
  letter-spacing: 1.1px;
  display: flex;
  align-items: center;
  margin-left: 7px;
  margin-right: 10px;
}
.nome-atendente-display {
  display: flex;
  flex-direction: column;
}
.atendente-nome img {
  height: 100%;
  border-radius: 50%;
  margin-right: 7px;
}
</style>