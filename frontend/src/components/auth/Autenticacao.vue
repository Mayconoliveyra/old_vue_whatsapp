<template>
  <div class="autenticacao">
    <b-form class="form" @keydown.enter="autenticacaoStatus()">
      <b-row>
        <b-col cols="12">
          <b-form-group label="Usuário" label-form="login-usuario">
            <b-form-input
              id="login-usuario"
              autocomplete="off"
              type="text"
              v-model="atendente.nome_atendente"
              required
              @blur="verificarNomeUsuario()"
              list="lista-atendentes"
            />
            <b-form-datalist :options="atendentes" id="lista-atendentes"></b-form-datalist>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-form-group label="Senha" label-form="login-senha">
            <b-form-input
              autocomplete="off"
              maxlength="191"
              id="login-senha"
              type="password"
              v-model="atendente.senha"
              required
            />
          </b-form-group>
        </b-col>
        <b-col cols="12" class="text-center mt-3">
          <b-button @click="autenticacaoStatus()" class="w-75">ENTRAR</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "../../../global";

export default {
  name: "Autenticacao",
  data() {
    return {
      atendente: {},
      atendentes: [],
    };
  },
  methods: {
    loadAtendentes() {
      axios
        .get(`${baseApiUrl}/atendentes`)
        .then((res) => {
          res.data.forEach((element) => {
            if (!element.desativado) {
              this.atendentes.push(element.nome_atendente);
            }
          });
        })
        .catch(showError);
    },
    verificarNomeUsuario() {
      if (
        this.atendente.nome_atendente == "help" ||
        this.atendente.nome_atendente == "Help" ||
        this.atendente.nome_atendente == "HELP" ||
        this.atendente.nome_atendente == "hELP"
      ) {
        console.log("help");
      } else {
        if (!this.atendentes.includes(this.atendente.nome_atendente)) {
          this.atendente.nome_atendente = "";
        }
      }
    },
    autenticacaoStatus() {
      const modeloLogin = {
        nome_atendente: this.atendente.nome_atendente,
        senha: this.atendente.senha,
      };
      axios
        .post(`${baseApiUrl}/autenticacao-status`, modeloLogin)
        .then(async (res) => {
          await this.$store.commit("setDataAutenticacao", res.data);
          this.getStatusAutenticar();
        })
        .catch(showError);
    },
    getStatusAutenticar() {
      axios
        .get(`${baseApiUrl}/get-status-whatsapp`)
        .then(async (res) => {
          if (res.data.status_atual == "CONNECTED") {
            this.$router.push({ name: "home" });
          } else {
            this.$router.push({ name: "autenticacao-whatsapp" });
          }
        })
        .catch(showError);
    },
  },
  created() {
    this.loadAtendentes();
  },
};
</script>

<style scoped>
.autenticacao {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 8vh;
}
.form {
  width: 35vw;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(223, 223, 223);
  box-sizing: border-box;
  box-shadow: rgb(0 0 0 / 25%) 0px 2px 4px;
  padding: 30px 25px;
  border-radius: 7px;
}
</style>