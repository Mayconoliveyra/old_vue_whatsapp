<template>
  <div class="autenticacao-whatsapp">
    <div class="status-atual">
      <div v-if="dataStatus.nome_empresa">Empresa: {{dataStatus.nome_empresa}}</div>
      <div v-if="dataStatus.contato_empresa">Número: {{dataStatus.contato_empresa}}</div>
      <div v-if="dataStatus.status_atual">Status: {{dataStatus.status_atual}}</div>
      <div v-if="dataStatus.falha_autenticar">{{dataStatus.falha_autenticar}}</div>
    </div>
    <div class="autenticar">
      <div class="text-center">
        <div class="segundos">{{segundos}}</div>
        <Qrcode v-if="qrcodeData" background="#f5f5f5" :value="qrcodeData" :size="265" />
      </div>
      <div class="msg-autenticar">
        <h1>Para autenticar o WhatsApp:</h1>
        <p>1. Abra o WhatsApp no seu celular.</p>
        <p>
          2. Toque em
          <b>
            Mais opções
            <b-icon
              icon="three-dots-vertical"
              style="background:#e6e3e3; padding:2px;"
              font-scale="1.4"
            ></b-icon>
          </b> ou Configurações
          <b>
            <b-icon
              icon="gear-wide-connected"
              style="background:#e6e3e3; padding:3px;"
              font-scale="1.5"
            ></b-icon>
          </b>
          e selecione
          <b>Aparelhos conectados.</b>
        </p>
        <p>
          3. Toque em
          <b>CONECTAR UM APARELHO</b>
        </p>
        <p>4. Aponte seu celular para esta tela para capturar o código.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Qrcode from "v-qrcode/src/index";
import axios from "axios";
import { baseApiUrl, showError } from "../../../global";
export default {
  name: "AutenticacaoWhatsapp",
  data() {
    return {
      qrcodeData: "",
      segundos: null,
      ponteiroLoadQrcode: "",
      ponteiroStatusWhatsapp: "",
      dataStatus: {},
    };
  },
  components: {
    Qrcode,
  },
  methods: {
    /* Carrega o qrcode vindo do backpende */
    loadQrCodeAutenticacaoWhatsApp() {
      const url = `${baseApiUrl}/autenticacao-whatsapp`;
      axios
        .get(url)
        .then((res) => {
          /* Chama o temporizadoe que vai contar 35 segundos */
          this.loadTemporizadorAutenticacao(35);
          this.qrcodeData = res.data;
        })
        .catch(showError);
    },
    /* Apos finalizar os segundos chama a função que vai verificar se o usuario esta logado:*/
    loadTemporizadorAutenticacao(duration) {
      var timer = duration,
        seconds;
      this.ponteiroLoadQrcode = setInterval(() => {
        seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        this.segundos = seconds;
        if (--timer < 0) {
          this.loadStatusAutenticaoWhatsApp();
          clearInterval(this.ponteiroLoadQrcode);
        }
      }, 1000);
    },
    /* Se retornar "False", significa que o usuario não está logado, logo sera chamado a função pra carregar um novo QrCode. */
    loadStatusAutenticaoWhatsApp() {
      axios
        .get(`${baseApiUrl}/get-status-whatsapp`)
        .then(async (res) => {
          if (res.data.status_atual == "CONNECTED") {
            this.$router.push({ name: "home" });
          } else {
            this.loadQrCodeAutenticacaoWhatsApp();
          }
        })
        .catch(() => {
          this.$router.push({ name: "autenticacao" });
        });
    },
  },
  created() {
    this.loadStatusAutenticaoWhatsApp();
    this.ponteiroStatusWhatsapp = setInterval(() => {
      axios
        .get(`${baseApiUrl}/get-status-whatsapp`)
        .then(async (res) => {
          this.dataStatus = res.data;
          if (res.data.status_atual == "CONNECTED") {
            this.$router.push({ name: "home" });
          }
        })
        .catch(() => {
          this.$router.push({ name: "autenticacao" });
        });
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.ponteiroLoadQrcode);
    clearInterval(this.ponteiroStatusWhatsapp);
  },
  computed: mapState(["dataAutenticacao"]),
};
</script>

<style  scoped>
.autenticacao-whatsapp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
.autenticar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.msg-autenticar {
  max-width: 556px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.msg-autenticar h1 {
  margin: 0px;
  font-size: 25px;
  font-weight: 100 !important;
  line-height: normal;
  color: #41525d;
  width: 100%;
}
.msg-autenticar p {
  width: 100%;
  margin-left: 25px;
  margin: 3px 0px;
}
.segundos {
  font-weight: 900;
  font-size: 35px;
  margin-bottom: 10px;
  color: #41525d;
  margin-left: 15px;
}
.btn-gerar-qrcode {
  padding: 10px;
  margin-bottom: 30px;
  border-radius: 5px;
}
.status-atual div {
  font-size: 14px;
  font-weight: 900;
  margin: 0px 5px;
}
</style>