<template>
  <div class="m-0 p-3">
    <!-- PAGINADOR -->
    <b-row class="row-paginador m-0 pt-4">
      <b-form-group label-for="perPageSelect">
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          aling="left"
          size="sm"
          :options="pageOptions"
        ></b-form-select>
      </b-form-group>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRowsTable"
        :per-page="perPage"
        align="end"
        size="sm"
      ></b-pagination>
    </b-row>
    <!-- TABELA -->
    <b-table
      small
      show-empty
      bordered
      :items="dataCadastros"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :filterIgnoredFields="filterIgnored"
      @filtered="onFiltered"
      @row-dblclicked="carregarTelaEdicao"
      tbody-tr-class="linhaTabela"
      emptyFilteredText="Não foi encontrado nenhum registro para os filtros informados!"
    >
      <template v-slot:cell(desativado)="row">
        <b-icon v-if="!row.item.desativado" icon="circle-fill" style="color:#00a65a;" scale="1.3"></b-icon>
        <b-icon v-else icon="circle-fill" style="color:#f56954" scale="1.3"></b-icon>
      </template>
      <template v-slot:cell(cadastrado_em)="row">
        <div>{{ row.item.cadastrado_em | maskDataDataHora}}</div>
      </template>

      <!-- CAMPANHA -->
      <template v-slot:cell(confirmado_em)="row">
        <div>{{ row.item.confirmado_em | maskDataDataHora}}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "TabelaExibicaoCadastro",
  data() {
    return {
      perPage: 30,
      pageOptions: [10, 30, 50, 100, 200, 400],
      currentPage: 1,
      filter: null,
      totalRowsTable: 0,
    };
  },
  props: ["dataCadastros", "fields", "filterOn", "filterIgnored", "totalRows"],
  methods: {
    onFiltered(filteredItems) {
      this.totalRowsTable = filteredItems.length;
      this.currentPage = 1;
    },
    carregarTelaEdicao(item) {
      this.$root.$emit("carregaRegistro", item, "save");
    },
  },
  watch: {
    totalRows() {
      this.totalRowsTable = this.totalRows;
    },
  },
  created() {
    this.totalRowsTable = this.totalRows;
    /* Exclui a instancia antes de criar, para evitar que seja duplicada caso ja exista. */
    this.$root.$off("emitFilterTable", this.fn);
    this.$root.$on("emitFilterTable", (filter) => {
      this.filter = filter;
    });
  },
};
</script>

<style>
.table {
  border: solid 3px #dee2e6 !important ;
}
.table thead tr {
  font-size: 0.86rem;
  color: rgb(0, 0, 0);
  background-color: rgba(251, 251, 251, 0.658);
}
.row-paginador {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
}
.row-paginador > div {
  width: 155px;
}
.linhaTabela {
  font-size: 0.775rem;
  color: rgb(0, 0, 0);
  border: 2px solid #dee2e6;
  -webkit-touch-callout: none; /* iPhone OS, Safari */
  -webkit-user-select: none; /* Chrome, Safari 3 */
  -khtml-user-select: none; /* Safari 2 */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* Possível implementação no futuro */
  cursor: pointer;
}
.linhaTabela:hover {
  background-color: rgb(236, 236, 236);
}
.linhaTabela td {
  overflow: hidden !important;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 7px 5px;
}
.linhaTabela td > div {
  overflow: hidden;
  white-space: nowrap;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
.codigo_serial {
  text-align: center;
  width: 110px;
  max-width: 110px;
}
.status {
  width: 100px;
  max-width: 100px;
  text-align: center;
}
.cadastrado_em {
  text-align: center;
  width: 145px;
  max-width: 145px;
}

/* CLIENTES */
.clientes_nmr_whatsapp {
  width: 127px;
  max-width: 137px;
}
.clientes_cpf_cnpj {
  width: 155px;
  max-width: 155px;
}
.clientes_empresa {
  width: 200px;
  max-width: 200px;
}

/* ATENDENTES */
.atendentes_perfil {
  width: 200px;
  max-width: 200px;
}

/* CAMPANHAS */
.campanhas_origem {
  width: 110px;
  max-width: 110px;
}
.campanhas_nome_atendente {
  width: 120px;
  max-width: 120px;
}
.campanhas_confirmado_em {
  text-align: center;
  width: 147px;
  max-width: 147px;
}
.campanhas_status {
  text-align: center;
  width: 145px;
  max-width: 145px;
}
</style>