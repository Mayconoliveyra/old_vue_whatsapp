<template>
  <div class="cadastro-clientes" v-if="this.dataAutenticacao.menu_clientes">
    <TituloCadastro
      icone="people"
      titulo="Cadastro de Clientes"
      :codigo="cliente.codigo_serial"
      :api="cliente.api"
      :exibirBtnCadastro="true"
      @criarNovoCadastro="reset(), modeNavegar('save')"
      @cancelarCadastro="reset(), modeNavegar()"
      @salvarRegistro="save()"
      @excluirRegistro="remove()"
      :mode="mode"
      :permissaoCadastrar="dataAutenticacao.cadastrar_clientes"
      :permissaoAlterar="dataAutenticacao.alterar_clientes"
      :permissaoExcluir="dataAutenticacao.excluir_clientes"
    />
    <div v-if="mode !== null">
      <b-form v-if="mode !== 'null'" class="form-cadastro">
        <input type="hidden" id="cliente-id" v-model="cliente.codigo_serial" />
        <b-row>
          <b-col cols="3">
            <b-form-group label="Código integração" label-form="cliente-codigo_integracao">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="cliente-codigo_integracao"
                type="text"
                v-model="cliente.codigo_integracao"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_clientes) && Boolean(cliente.codigo_serial) || Boolean(cliente.api)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-group label="Número WhatsApp*" label-form="cliente-contato">
              <the-mask
                autocomplete="off"
                size="sm"
                class="form-control form-control-sm"
                id="cliente-contato"
                type="text"
                v-model="cliente.nmr_whatsapp"
                :mask="['(##) ####-####','(##) #####-####']"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_clientes) && Boolean(cliente.codigo_serial)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group label="CPF/CNPJ" label-form="cliente-documento">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="cliente-documento"
                type="text"
                v-model="cliente.cpf_cnpj"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_clientes) && Boolean(cliente.codigo_serial) || Boolean(cliente.api)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="2">
            <b-form-group label="Status" label-form="cliente-desativado">
              <b-form-select
                id="cliente-desativado"
                type="text"
                v-model="cliente.desativado"
                required
                :disabled="Boolean(!dataAutenticacao.alterar_clientes) && Boolean(cliente.codigo_serial) || Boolean(cliente.api)"
              >
                <b-form-select-option value="false">Ativo</b-form-select-option>
                <b-form-select-option value="true">Desativado</b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Nome do contato*" label-form="cliente-nome">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="cliente-nome"
                type="text"
                v-model="cliente.nome_cliente"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_clientes) && Boolean(cliente.codigo_serial)"
              />
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Empresa do cliente" label-form="cliente-empresa">
              <b-form-input
                autocomplete="off"
                size="sm"
                maxlength="191"
                id="cliente-empresa"
                type="text"
                v-model="cliente.empresa"
                required
                :readonly="Boolean(!dataAutenticacao.alterar_clientes) && Boolean(cliente.codigo_serial) || Boolean(cliente.api)"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
    </div>
    <div v-show="mode == null">
      <InputPesquisaCadastro />
      <TabelaExibicaoCadastro
        :dataCadastros="dataClientes"
        :totalRows="dataClientes.length"
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
  name: "Cliente",
  components: {
    TituloCadastro,
    InputPesquisaCadastro,
    TabelaExibicaoCadastro,
  },
  data() {
    return {
      cliente: {},
      dataClientes: [],
      mode: null,
      filterOn: [],
      filterIgnored: [],
      fields: [
        {
          key: "codigo_serial",
          label: "Código",
          sortable: true,
          class: "codigo_serial",
          sortDirection: "desc",
        },
        {
          key: "codigo_integracao",
          label: "Integração",
          sortable: true,
          class: "codigo_serial",
          sortDirection: "desc",
        },
        {
          key: "nome_cliente",
          label: "Nome",
          sortable: true,
        },
        {
          key: "nmr_whatsapp",
          label: "Contato",
          sortable: true,
          class: "clientes_nmr_whatsapp",
          formatter: (value) => {
            if (value) {
              value = value.replace(/\D/g, ""); //Remove tudo o que não é dígito
              value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
              value = value.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
              return value;
            }
            return value;
          },
        },
        {
          key: "cpf_cnpj",
          label: "CNPJ/CPF",
          class: "clientes_cpf_cnpj",
          sortable: true,
          formatter: (value) => {
            if (String(value).length == 14) {
              return value.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                "$1.$2.$3/$4-$5"
              );
            }
            if (String(value).length == 11) {
              return value.replace(
                /^(\d{3})(\d{3})(\d{3})(\d{2})/,
                "$1.$2.$3-$4"
              );
            } else {
              return value;
            }
          },
        },
        {
          key: "empresa",
          label: "Empresa",
          sortable: true,
          class: "clientes_empresa",
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
      this.cliente.desativado = false;
    },
    loadClientes() {
      axios
        .get(`${baseApiUrl}/clientes`)
        .then((res) => {
          this.dataClientes = res.data;
        })
        .catch(showError);
    },
    loadCliente(cliente, mode = "null") {
      if (cliente.codigo_serial) {
        this.mode = mode;
        this.cliente = cliente;
      }
    },
    save() {
      const id = this.cliente.codigo_serial
        ? `/${this.cliente.codigo_serial}`
        : "";
      const url = `${baseApiUrl}/clientes${id}`;
      const method = this.cliente.codigo_serial ? "put" : "post";

      axios[method](url, this.cliente)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      axios
        .delete(`${baseApiUrl}/clientes/${this.cliente.codigo_serial}`)
        .then(() => {
          showSucesso();
          this.reset();
        })
        .catch(showError);
    },
    reset() {
      this.mode = null;
      this.cliente = {};
      this.loadClientes();
    },
  },
  computed: mapState(["dataAutenticacao"]),
  created() {
    /* Se não  tiver permissao pra entrar na pagina e mesmo assim tiver forçando, redireciona para tela de login. */
    if (!this.dataAutenticacao.menu_clientes) {
      this.$store.commit("setDataAutenticacao", {});
      this.$router.push({ name: "autenticacao" });
    }
    this.loadClientes();
    // AO CLICAR NO BOTÃO DE ALTERAR OU EXCLUIR NA "TabelaExibicaoCadastro", ESSA FUNÇÃO É EXECUTADA
    /* Exclui a instancia antes de criar, para evitar que seja duplicada caso ja exista. */
    this.$root.$off("carregaRegistro", this.fn);
    this.$root.$on("carregaRegistro", (registro, mode) => {
      this.loadCliente(registro, mode);
    });
  },
};
</script>
<style scoped>
.cadastro-clientes {
  flex: 1;
}
</style>