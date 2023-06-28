<template>
  <div class="cadastro-empresas" v-if="this.dataAutenticacao.menu_empresas">
    <TituloCadastro
      titulo="Cadastro de Empresas"
      :codigo="empresa.codigo_empresa"
      :ativarDesativar="empresa.desativado"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      @salvarRegistro="save()"
      @ativarDesativar="reativarDesativar()"
      :mode="mode"
      :permissaoCadastrar="dataAutenticacao.cadastrar_empresas"
      :permissaoAlterar="dataAutenticacao.alterar_empresas"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="form-cadastro">
        <input type="hidden" id="empresa-id" v-model="empresa.codigo_empresa" />
        <b-row>
          <b-col cols="2">
            <b-form-group label="Código" label-form="empresa-codigo">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="empresa-codigo"
                type="text"
                v-model="empresa.codigo_empresa"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Nome da empresa*" label-form="empresa-nome">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="empresa-nome"
                type="text"
                v-model="empresa.nome_empresa"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_empresas) && Boolean(empresa.codigo_empresa)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group label="Número de contato*" label-form="empresa-contato">
              <the-mask
                autocomplete="off"
                size="sm"
                class="form-control form-control-sm"
                id="empresa-contato"
                type="text"
                v-model="empresa.contato_empresa"
                :mask="['+## (##) ####-####']"
                required
                :readonly="empresa.codigo_empresa"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataEmpresas"
        :totalRows="dataEmpresas.length"
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
import TituloCadastro from "../components/TituloCadastro";
import InputPesquisaCadastro from "../components/InputPesquisaCadastro";
import TabelaExibicaoCadastro from "../components/TabelaExibicaoCadastro";
export default {
  name: "empresas",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
  },
  data() {
    return {
      empresa: {},
      dataEmpresas: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_empresa",
          label: "Código",
          sortable: true,
          class: "empresas_codigo",
          sortDirection: "desc",
        },
        {
          key: "nome_empresa",
          label: "Nome",
          sortable: true,
          class: "empresas_nome",
        },
        {
          key: "contato_empresa",
          label: "Contato",
          sortable: true,
          class: "empresas_contato",
        },
        {
          key: "desativado",
          label: "Status",
          class: "status",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    modeNavegar(mode = null) {
      this.mode = mode;
    },
    loadEmpresas() {
      axios
        .get(`${baseApiUrl}/empresas`)
        .then((res) => {
          this.dataEmpresas = res.data;
        })
        .catch(showError);
    },
    loadEmpresa(empresa, mode = "null") {
      if (empresa.codigo_empresa) {
        this.mode = mode;
        this.empresa = empresa;
      }
    },
    save() {
      const id = this.empresa.codigo_empresa
        ? `/${this.empresa.codigo_empresa}`
        : "";
      const url = `${baseApiUrl}/empresas${id}`;
      const method = this.empresa.codigo_empresa ? "put" : "post";

      axios[method](url, this.empresa)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    reativarDesativar() {
      axios
        .delete(`${baseApiUrl}/empresas/${this.empresa.codigo_empresa}`)
        .then(() => {
          showSucesso();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.empresa = {};
      this.loadEmpresas();
    },
  },
  computed: mapState(["dataAutenticacao"]),
  created() {
    /* Se não  tiver permissao pra entrar na pagina e mesmo assim tiver forçando, redireciona para tela de login. */
    if (!this.dataAutenticacao.menu_empresas) {
      this.$store.commit("setDataAutenticacao", {});
      this.$router.push({ name: "autenticacao" });
    }
    this.loadEmpresas();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadEmpresa(registro, mode);
    });
  },
};
</script>

<style scoped>
.cadastro-empresas {
  height: 100%;
}
</style>