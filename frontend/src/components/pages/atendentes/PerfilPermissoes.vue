<template>
  <div class="perfil-permissoes" v-if="this.dataAutenticacao.menu_permissoes">
    <TituloCadastro
      titulo="Cadastro de Permissões"
      :codigo="perfil.codigo_perfil"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      @salvarRegistro="save()"
      @excluirRegistro="remove()"
      :mode="mode"
      :permissaoCadastrar="dataAutenticacao.cadastrar_permissoes"
      :permissaoAlterar="dataAutenticacao.alterar_permissoes"
      :permissaoExcluir="dataAutenticacao.excluir_permissoes"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="form-cadastro">
        <input type="hidden" id="perfil-id" v-model="perfil.codigo_perfil" />
        <b-row>
          <b-col cols="2">
            <b-form-group label="Código" label-form="perfil-codigo">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="perfil-codigo"
                type="text"
                v-model="perfil.codigo_perfil"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="8">
            <b-form-group label="Nome*" label-form="perfil-nome">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="perfil-nome"
                type="text"
                v-model="perfil.nome_perfil"
                required
                :disabled="Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Status" label-form="perfil-desativado">
              <b-form-select
                id="perfil-desativado"
                type="text"
                v-model="perfil.desativado"
                required
                :disabled="Boolean(!dataAutenticacao.alterar_atendentes) && Boolean(perfil.codigo_perfil)"
              >
                <b-form-select-option value="false">Ativo</b-form-select-option>
                <b-form-select-option value="true">Desativado</b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <hr class="mt-1" />
          </b-col>
        </b-row>
        <b-row class="row-permissao">
          <b-col cols="3">
            <div class="cont-permissao">
              <h5>CAMPANHAS</h5>
              <b-form-checkbox
                size="md"
                id="perfil-campanhas-visualizar"
                v-model="perfil.menu_campanhas"
                name="perfil-campanhas-visualizar"
                :value="true"
                :unchecked-value="false"
                :disabled="Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Visualizar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-campanhas-adicionar"
                v-model="perfil.cadastrar_campanhas"
                name="perfil-campanhas-adicionar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_clientes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Adicionar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-campanhas-alterar"
                v-model="perfil.alterar_campanhas"
                name="perfil-campanhas-alterar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_clientes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Alterar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-campanhas-excluir"
                v-model="perfil.excluir_campanhas"
                name="perfil-campanhas-excluir"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_clientes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Excluir</b-form-checkbox>
            </div>
          </b-col>
          <b-col cols="3">
            <div class="cont-permissao">
              <h5>CLIENTES</h5>
              <b-form-checkbox
                size="md"
                id="perfil-clientes-visualizar"
                v-model="perfil.menu_clientes"
                name="perfil-clientes-visualizar"
                :value="true"
                :unchecked-value="false"
                :disabled="Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Visualizar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-clientes-adicionar"
                v-model="perfil.cadastrar_clientes"
                name="perfil-clientes-adicionar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_clientes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Adicionar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-clientes-alterar"
                v-model="perfil.alterar_clientes"
                name="perfil-clientes-alterar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_clientes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Alterar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-clientes-excluir"
                v-model="perfil.excluir_clientes"
                name="perfil-clientes-excluir"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_clientes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Excluir</b-form-checkbox>
            </div>
          </b-col>
          <b-col cols="3">
            <div class="cont-permissao">
              <h5>ATENDENTES</h5>
              <b-form-checkbox
                size="md"
                id="perfil-atendentes-visualizar"
                v-model="perfil.menu_atendentes"
                name="perfil-atendentes-visualizar"
                :value="true"
                :unchecked-value="false"
                :disabled="Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Visualizar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-atendentes-adicionar"
                v-model="perfil.cadastrar_atendentes"
                name="perfil-atendentes-adicionar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_atendentes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Adicionar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-atendentes-alterar"
                v-model="perfil.alterar_atendentes"
                name="perfil-atendentes-alterar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_atendentes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Alterar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-atendentes-excluir"
                v-model="perfil.excluir_atendentes"
                name="perfil-atendentes-excluir"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_atendentes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Excluir</b-form-checkbox>
            </div>
          </b-col>
          <b-col cols="3">
            <div class="cont-permissao">
              <h5>PERFIL</h5>
              <b-form-checkbox
                size="md"
                id="perfil-perfil-visualizar"
                v-model="perfil.menu_permissoes"
                name="perfil-perfil-visualizar"
                :value="true"
                :unchecked-value="false"
                :disabled="Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Visualizar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-perfil-adicionar"
                v-model="perfil.cadastrar_permissoes"
                name="perfil-perfil-adicionar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_permissoes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Adicionar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-perfil-alterar"
                v-model="perfil.alterar_permissoes"
                name="perfil-perfil-alterar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_permissoes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Alterar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-perfil-excluir"
                v-model="perfil.excluir_permissoes"
                name="perfil-perfil-excluir"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_permissoes || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Excluir</b-form-checkbox>
            </div>
          </b-col>
        </b-row>
        <b-col cols="12">
          <hr class="mt-3" />
        </b-col>
        <b-row class="row-permissao">
          <b-col cols="3">
            <div class="cont-permissao">
              <h5>EMPRESA</h5>
              <b-form-checkbox
                size="md"
                id="perfil-empresa-visualizar"
                v-model="perfil.menu_empresas"
                name="perfil-empresa-visualizar"
                :value="true"
                :unchecked-value="false"
                :disabled="Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Visualizar</b-form-checkbox>
              <b-form-checkbox
                size="md"
                id="perfil-empresa-alterar"
                v-model="perfil.alterar_empresas"
                name="perfil-empresa-alterar"
                :value="true"
                :unchecked-value="false"
                :disabled="!perfil.menu_empresas || Boolean(!dataAutenticacao.alterar_permissoes) && Boolean(perfil.codigo_perfil)"
              >Alterar</b-form-checkbox>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataPerfils"
        :totalRows="dataPerfils.length"
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
  name: "Perfils",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
  },
  data() {
    return {
      perfil: {},
      dataPerfils: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_perfil",
          label: "Código",
          sortable: true,
          class: "codigo_serial",
          sortDirection: "desc",
        },
        {
          key: "nome_perfil",
          label: "Nome",
          sortable: true,
        },
        {
          key: "cadastrado_em",
          label: "Data Cadastro",
          sortable: true,
          class: "cadastrado_em",
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
      this.perfil.desativado = false;
    },
    loadPerfils() {
      axios
        .get(`${baseApiUrl}/perfil-permissoes`)
        .then((res) => {
          this.dataPerfils = res.data;
        })
        .catch(showError);
    },
    loadPerfil(perfil, mode = "null") {
      if (perfil.codigo_perfil) {
        this.mode = mode;
        this.perfil = perfil;
      }
    },
    save() {
      const id = this.perfil.codigo_perfil
        ? `/${this.perfil.codigo_perfil}`
        : "";
      const url = `${baseApiUrl}/perfil-permissoes${id}`;
      const method = this.perfil.codigo_perfil ? "put" : "post";

      axios[method](url, this.perfil)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      axios
        .delete(`${baseApiUrl}/perfil-permissoes/${this.perfil.codigo_perfil}`)
        .then(() => {
          showSucesso();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.perfil = {};
      this.loadPerfils();
    },
  },
  watch: {
    "perfil.menu_campanhas"() {
      if (!this.perfil.menu_campanhas) {
        this.perfil.cadastrar_campanhas = false;
        this.perfil.alterar_campanhas = false;
        this.perfil.excluir_campanhas = false;
      }
    },
    "perfil.menu_clientes"() {
      if (!this.perfil.menu_clientes) {
        this.perfil.cadastrar_clientes = false;
        this.perfil.alterar_clientes = false;
        this.perfil.excluir_clientes = false;
      }
    },
    "perfil.menu_atendentes"() {
      if (!this.perfil.menu_atendentes) {
        this.perfil.cadastrar_atendentes = false;
        this.perfil.alterar_atendentes = false;
        this.perfil.excluir_atendentes = false;
      }
    },
    "perfil.menu_permissoes"() {
      if (!this.perfil.menu_permissoes) {
        this.perfil.cadastrar_permissoes = false;
        this.perfil.alterar_permissoes = false;
        this.perfil.excluir_permissoes = false;
      }
    },
    "perfil.menu_empresas"() {
      if (!this.perfil.menu_empresas) {
        this.perfil.alterar_empresas = false;
      }
    },
  },
  computed: mapState(["dataAutenticacao"]),
  created() {
    /* Se não  tiver permissao pra entrar na pagina e mesmo assim tiver forçando, redireciona para tela de login. */
    if (!this.dataAutenticacao.menu_permissoes) {
      this.$store.commit("setDataAutenticacao", {});
      this.$router.push({ name: "autenticacao" });
    }
    this.loadPerfils();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    /* Exclui a instancia antes de criar, para evitar que seja duplicada caso ja exista. */
    this.$root.$off("carregaRegistro", this.fn);
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadPerfil(registro, mode);
    });
  },
};
</script>

<style scoped>
.perfil-permissoes {
  flex: 1;
}
.row-permissao div {
  padding: 2px;
}
.cont-permissao {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: solid 2px rgb(222, 219, 219);
  border-radius: 2px;
  padding: 0px;
  height: 100%;
  width: 100%;
}
.row-permissao div:last-child .cont-permissao {
  border-right: none;
}
</style>