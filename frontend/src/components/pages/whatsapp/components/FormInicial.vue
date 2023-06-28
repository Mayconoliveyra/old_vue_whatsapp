<template>
  <div v-if="mode !== 'null'" class="formwpp">
    <input type="hidden" id="campanha-id" v-model="campanha.codigo_campanha" />
    <b-row>
      <b-col cols="2">
        <b-form-group label="Código" label-form="campanha-codigo">
          <b-form-input
            autocomplete="off"
            size="sm"
            id="campanha-codigo"
            type="text"
            v-model="campanha.codigo_campanha"
            required
            readonly
          />
        </b-form-group>
      </b-col>
      <b-col cols="2">
        <b-form-group label="Atendete" label-form="campanha-atendente">
          <b-form-input
            autocomplete="off"
            size="sm"
            maxlength="191"
            id="campanha-atendente"
            type="text"
            v-model="campanha.nome_atendente"
            required
            readonly
          />
        </b-form-group>
      </b-col>
      <b-col cols="2">
        <b-form-group label="Origem" label-form="campanha-origem">
          <b-form-input
            autocomplete="off"
            size="sm"
            maxlength="191"
            id="campanha-origem"
            type="text"
            v-model="campanha.origem"
            required
            readonly
          />
        </b-form-group>
      </b-col>
      <b-col cols="2">
        <b-form-group label="Data Confirmado" label-form="campanha-confirmado">
          <div class="input-exibir">{{campanha.confirmado_em| maskDataDataHora}}</div>
        </b-form-group>
      </b-col>
      <b-col cols="2">
        <b-form-group label="Data Cadastro" label-form="campanha-cadastro">
          <div class="input-exibir">{{campanha.cadastrado_em| maskDataDataHora}}</div>
        </b-form-group>
      </b-col>
      <b-col cols="2">
        <b-form-group label="Status" label-form="campanha-status">
          <b-form-select
            id="campanha-confirmado"
            type="text"
            v-model="campanha.status"
            required
            :disabled="Boolean(!dataAutenticacao.alterar_campanha) && Boolean(campanha.confirmado_em)"
          >
            <b-form-select-option value="Preparando">Preparando</b-form-select-option>
            <b-form-select-option value="Confirmado">Confirmado</b-form-select-option>
            <b-form-select-option disabled value="Finalizado">Finalizado</b-form-select-option>
            <b-form-select-option disabled value="Finalizado">Finalizado com erros</b-form-select-option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="12">
        <b-form-group label="Campanha*" label-form="campanha-campanha">
          <b-form-input
            id="campanha-campanha"
            autocomplete="off"
            type="text"
            v-model="campanha.titulo_campanha"
            required
            @blur="verificarTituloCampanha()"
            list="list-titulos"
            :readonly="Boolean(!dataAutenticacao.alterar_campanha) && Boolean(campanha.confirmado_em)"
          />

          <b-form-datalist :options="dataTituloCampanha" id="list-titulos"></b-form-datalist>
        </b-form-group>
      </b-col>
      <b-col cols="12">
        <b-form-group label-size="sm" label="Conteudo*" label-form="campanha-conteudo">
          <b-form-textarea
            id="campanha-conteudo"
            v-model="campanha.mensagem_texto"
            :disabled="mode == 'remove'"
            rows="5"
            :readonly="Boolean(!dataAutenticacao.alterar_campanha) && Boolean(campanha.confirmado_em)"
          ></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
    <div class="clientes-selecionados">
      <!-- TABELA -->
      <b-table
        small
        show-empty
        bordered
        :items="dataClienteSelecionado"
        :fields="fields"
        tbody-tr-class="td-selecionados"
        emptyFilteredText="Lista vazia."
      ></b-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  nomae: "wppCampannhaInical",
  data() {
    return {
      dataTituloCampanha: [
        "Cobrança de títulos vencidos",
        "Cobrança de títulos a vence",
        "Cobrança de títulos",
        "Promoção",
        "Outros",
      ],
      fields: [
        {
          key: "id_cliente",
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
          class: "clientes_nome-cli",
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
          key: "mensagem_texto",
          label: "Mensagem",
          sortable: true,
          class: "clientes-msg-text",
        },
        {
          key: "msg_result",
          label: "Resultado",
          sortable: true,
          class: "clientes-msg-result",
        },
      ],
    };
  },
  props: {
    campanha: {},
    mode: String,
    dataClienteSelecionado: Array,
  },
  methods: {
    verificarTituloCampanha() {
      if (!this.dataTituloCampanha.includes(this.campanha.titulo_campanha)) {
        this.campanha.titulo_campanha = "";
      }
    },
  },
  computed: mapState(["dataAutenticacao"]),
};
</script>

<style>
.formwpp {
  flex-direction: column;
  height: calc(100vh - 160px);
  display: flex;
  padding: 15px 25px;
  margin: 15px;
  border: #cccccc solid 1px;
  border-radius: 3px;
  background: #ffffff;
  color: #504f4f;
}
.formwpp .clientes-selecionados {
  display: flex;
  overflow-y: scroll;
}
.formwpp .clientes-msg-result {
  width: 400px;
  max-width: 400px;
}
.formwpp .clientes_nome-cli {
  width: 300px;
  max-width: 300px;
}
.formwpp .clientes-msg-text {
  max-width: 200px;
}
.formwpp .td-selecionados td {
  overflow: hidden !important;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px;
  font-size: 11px;
}
</style>