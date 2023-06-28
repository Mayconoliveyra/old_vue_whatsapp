<template>
  <div class="cadastro-atendentes" v-if="this.dataAutenticacao.menu_atendentes">
    <TituloCadastro
      icone="headset"
      titulo="Cadastro de Atendentes"
      :codigo="atendente.codigo_atendente"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      @salvarRegistro="save()"
      @excluirRegistro="remove()"
      :mode="mode"
      :permissaoCadastrar="dataAutenticacao.cadastrar_atendentes"
      :permissaoAlterar="dataAutenticacao.alterar_atendentes"
      :permissaoExcluir="dataAutenticacao.excluir_atendentes"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="form-cadastro">
        <input type="hidden" id="atendente-id" v-model="atendente.codigo_atendente" />
        <b-row>
          <b-col cols="2">
            <b-form-group label="Código" label-form="atendente-codigo">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="atendente-codigo"
                type="text"
                v-model="atendente.codigo_atendente"
                required
                readonly
              />
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Nome*" label-form="atendente-nome">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="atendente-nome"
                type="text"
                v-model="atendente.nome_atendente"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_atendentes) && Boolean(atendente.codigo_atendente)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Senha*" label-form="atendente-senha">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="atendente-senha"
                type="password"
                v-model="atendente.senha"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_atendentes) && Boolean(atendente.codigo_atendente)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="3" class="pr-0">
            <b-form-group label="Perfil de permissões*" label-form="atendente-perfil">
              <b-input-group class="input-perfil">
                <b-form-select
                  autocomplete="off"
                  id="atendente-perfil"
                  maxlength="191"
                  v-model="atendente.id_perfil"
                  required
                  :disabled="Boolean(!dataAutenticacao.alterar_atendentes) && Boolean(atendente.codigo_atendente)"
                >
                  <option
                    v-for="(option, index) in perfisPermissoes"
                    :value="option.codigo_perfil"
                    :key="index"
                    v-show="!option.desativado"
                  >{{ option.nome_perfil }}</option>
                </b-form-select>
                <router-link v-if="dataAutenticacao.menu_permissoes" to="/perfil-permissoes">
                  <b-icon icon="gear-fill" scale="1.3"></b-icon>
                </router-link>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Status" label-form="atendente-desativado">
              <b-form-select
                id="atendente-desativado"
                type="text"
                v-model="atendente.desativado"
                required
                :disabled="Boolean(!dataAutenticacao.alterar_atendentes) && Boolean(atendente.codigo_atendente)"
              >
                <b-form-select-option value="false">Ativo</b-form-select-option>
                <b-form-select-option value="true">Desativado</b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataAtendentes"
        :totalRows="dataAtendentes.length"
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
  name: "Atendentes",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
  },
  data() {
    return {
      atendente: {},
      dataAtendentes: [],
      perfisPermissoes: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_atendente",
          label: "Código",
          sortable: true,
          class: "codigo_serial",
          sortDirection: "desc",
        },
        {
          key: "nome_atendente",
          label: "Nome",
          sortable: true,
        },
        {
          key: "nome_perfil",
          label: "Perfil",
          sortable: true,
          class: "atendentes_perfil",
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
      this.atendente.desativado = false;
    },
    loadAtendentes() {
      axios
        .get(`${baseApiUrl}/atendentes`)
        .then((res) => {
          this.dataAtendentes = res.data;
        })
        .catch(showError);
    },
    loadPerfisPermissoes() {
      axios
        .get(`${baseApiUrl}/perfil-permissoes`)
        .then((res) => {
          this.perfisPermissoes = res.data;
        })
        .catch(showError);
    },
    loadAtendente(atendente, mode = "null") {
      if (atendente.codigo_atendente) {
        this.mode = mode;
        this.atendente = atendente;
      }
    },
    save() {
      const id = this.atendente.codigo_atendente
        ? `/${this.atendente.codigo_atendente}`
        : "";
      const url = `${baseApiUrl}/atendentes${id}`;
      const method = this.atendente.codigo_atendente ? "put" : "post";

      axios[method](url, this.atendente)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      axios
        .delete(`${baseApiUrl}/atendentes/${this.atendente.codigo_atendente}`)
        .then(() => {
          showSucesso();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.atendente = {};
      this.loadAtendentes();
    },
  },
  computed: mapState(["dataAutenticacao"]),
  created() {
    /* Se não  tiver permissao pra entrar na pagina e mesmo assim tiver forçando, redireciona para tela de login. */
    if (!this.dataAutenticacao.menu_atendentes) {
      this.$store.commit("setDataAutenticacao", {});
      this.$router.push({ name: "autenticacao" });
    }
    this.loadPerfisPermissoes();
    this.loadAtendentes();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    /* Exclui a instancia antes de criar, para evitar que seja duplicada caso ja exista. */
    this.$root.$off("carregaRegistro", this.fn);
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadAtendente(registro, mode);
    });
  },
};
</script>
 
<style scoped>
.cadastro-atendentes {
  flex: 1;
}
.input-perfil select {
  height: 34px;
  font-size: 14px;
}
.input-perfil a {
  margin-left: 0px;
  padding: 0px 15px 0px 15px;
  background-color: rgb(255, 255, 255);
  border: none !important;
  color: rgb(255, 111, 0);
  display: flex;
  align-items: center;
}
</style>