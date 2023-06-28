<template>
  <div class="form-cadastro-1">
    <div class="nav-campanha" v-if="Boolean(!campanha.confirmado_em)">
      <button type="button" @click="setExibir()">INICIO</button>
      <button type="button" @click="telaExibir='CLIENTES'">CLIENTES</button>
    </div>
    <FormInicial
      v-show="telaExibir=='INICIO'"
      :campanha="campanha"
      :dataClienteSelecionado="dataClienteSelecionado"
      :mode="mode"
    />
    <div v-if="telaExibir=='CLIENTES'">
      <WppInputPesqClientes />
      <WppTableClientes
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
import FormInicial from "./FormInicial";
import WppTableClientes from "./WppTableClientes";
import WppInputPesqClientes from "./WppInputPesqClientes";
export default {
  name: "wppCampanhaCadastrar",
  components: { FormInicial, WppTableClientes, WppInputPesqClientes },
  data() {
    return {
      telaExibir: "INICIO",
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
          key: "selecionado",
          label: "Selecionar",
          class: "status",
          sortable: true,
        },
      ],
    };
  },
  props: {
    campanha: {},
    dataClientes: Array,
    dataClienteSelecionado: Array,
    mode: String,
  },
  methods: {
    setExibir() {
      this.telaExibir = "INICIO";
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
    },
  },
};
</script>

<style scoped>
.form-cadastro-1 {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.nav-campanha {
  width: 100%;
  padding: 0px 15px;
}
.nav-campanha button {
  padding: 4px 10px;
  margin-right: 4px;
  border-radius: 2px;
  width: 150px;
  letter-spacing: 1px;
}
</style>