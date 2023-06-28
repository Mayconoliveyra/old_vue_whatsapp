<template>
  <div class="wpp-campanha" v-if="this.dataAutenticacao.menu_campanhas">
    <WppTituloCadastro
      icone="whatsapp"
      titulo="Painel de controle"
      :campanha="campanha"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      @salvarRegistro="save()"
      @excluirRegistro="remove()"
      :mode="mode"
      :permissaoCadastrar="dataAutenticacao.cadastrar_campanhas"
      :permissaoAlterar="dataAutenticacao.alterar_campanhas"
      :permissaoExcluir="dataAutenticacao.excluir_campanhas"
    />
    <FormCadastrar
      v-if="mode !== null"
      :campanha="campanha"
      :dataClientes="dataClientes"
      :dataClienteSelecionado="dataClienteSelecionado"
      :mode="mode"
    />
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataCampanhas"
        :totalRows="dataCampanhas.length"
        :fields="fields"
        :filterOn="filterOn"
        :filterIgnored="filterIgnored"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { baseApiUrl, showError, showSucesso } from "../../../../global";
import axios from "axios";
import WppTituloCadastro from "./components/WppTituloCadastro";
import InputPesquisaCadastro from "../components/InputPesquisaCadastro";
import TabelaExibicaoCadastro from "../components/TabelaExibicaoCadastro";

import FormCadastrar from "./components/FormCadastrar";
export default {
  name: "WppMain",
  components: {
    WppTituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
    FormCadastrar,
  },
  data() {
    return {
      campanha: {},
      dataCampanhas: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      dataClientes: [] /* Array com todos clientes disponvel para ser selecionado para receber a mensagem */,
      dataClienteSelecionado: [] /* Array com os clientes que vai receber a mensagem */,
      fields: [
        {
          key: "codigo_campanha",
          label: "Código",
          sortable: true,
          class: "codigo_serial",
          sortDirection: "desc",
        },
        {
          key: "titulo_campanha",
          label: "Campanha",
          sortable: true,
        },
        {
          key: "nome_atendente",
          label: "Atendente",
          sortable: true,
          class: "campanhas_nome_atendente",
        },
        {
          key: "origem",
          label: "Origem",
          sortable: true,
          class: "campanhas_origem",
        },
        {
          key: "confirmado_em",
          label: "Data Confirmado",
          sortable: true,
          class: "campanhas_confirmado_em",
        },
        {
          key: "cadastrado_em",
          label: "Data Cadastro",
          sortable: true,
          class: "cadastrado_em",
        },
        {
          key: "status",
          label: "Status",
          class: "campanhas_status",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    async modeNavegar(mode = null) {
      this.mode = mode;
      /* Quando clica em 'Adicionar' mode recene 'Save' */
      if (mode == "save") {
        this.campanha.origem = "Gerenciador";
        this.campanha.status = "Preparando";
        this.campanha.nome_atendente = this.dataAutenticacao.nome_atendente;

        const url = `${baseApiUrl}/campanhas`;
        await axios
          .post(url, this.campanha)
          .then((res) => {
            this.loadClientesCampanhaID(res.data);
          })
          .catch(showError);
      }
    },
    loadCampanhas() {
      axios
        .get(`${baseApiUrl}/campanhas`)
        .then((res) => {
          this.dataCampanhas = res.data;
        })
        .catch(showError);
    },
    loadCampanha(campanha, mode = "null") {
      if (campanha.codigo_campanha) {
        this.mode = mode;
        this.campanha = campanha;
        /* Carrega o cadastros de clientes com a coluna[selecionado]*/
        /* Carrega dataClienteSelecionado, com todos clientes referente a campanha */
        this.loadClientesCampanhaID(campanha.codigo_campanha);
      }
    },
    save() {
      /* Seta os clientes que sera anexado a campanha */
      /* Limpa o array antes de adicionar */
      this.dataClienteSelecionado.splice(0, 999999);
      for (let index = 0; index < this.dataClientes.length; index++) {
        const element = this.dataClientes[index];
        if (element.selecionado) {
          const modelo = {
            id_campanha: this.campanha.codigo_campanha,
            id_cliente: element.codigo_serial,
            nome_cliente: element.nome_cliente,
            codigo_integracao: element.codigo_integracao,
            nmr_whatsapp: element.nmr_whatsapp,
            mensagem_texto: this.campanha.mensagem_texto,
          };
          this.dataClienteSelecionado.push(modelo);
        }
      }

      const url = `${baseApiUrl}/campanhas/${this.campanha.codigo_campanha}`;
      this.campanha.selecionados = this.dataClienteSelecionado; /* Data com todos clientes selecionados para enviar a mensagem */
      axios
        .put(url, this.campanha)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      axios
        .delete(`${baseApiUrl}/campanhas/${this.campanha.codigo_campanha}`)
        .then(() => {
          showSucesso();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.campanha = {};
      this.loadCampanhas();
    },
    /* Carrega o cadastros de clientes com a coluna[selecionado]*/
    /* Carrega dataClienteSelecionado, com todos clientes referente a campanha */
    loadClientesCampanhaID(codigo_campanha) {
      this.campanha.codigo_campanha = codigo_campanha;
      axios
        .get(`${baseApiUrl}/campanhas/${codigo_campanha}`)
        .then((res) => {
          this.dataClientes = res.data.clientes;
          this.dataClienteSelecionado = res.data.CliSelecionados;
        })
        .catch(showError);
    },
  },
  computed: mapState(["dataAutenticacao"]),
  created() {
    /* Se não  tiver permissao pra entrar na pagina e mesmo assim tiver forçando, redireciona para tela de login. */
    if (!this.dataAutenticacao.menu_campanhas) {
      this.$store.commit("setDataAutenticacao", {});
      this.$router.push({ name: "autenticacao" });
    }
    this.loadCampanhas();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    /* Exclui a instancia antes de criar, para evitar que seja duplicada caso ja exista. */
    this.$root.$off("carregaRegistro", this.fn);
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadCampanha(registro, mode);
    });
  },
};
</script>
<style scoped>
.wpp-campanha {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>