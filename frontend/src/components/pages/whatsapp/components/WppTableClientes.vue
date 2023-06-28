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
    <div>
      <b-button size="sm" @click="selectAllRows()">Todos</b-button>
      <b-button size="sm" @click="clearSelected()">Limpar</b-button>
    </div>
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
      @row-clicked="onRowSelected"
      tbody-tr-class="linhaTabela"
      emptyFilteredText="Não foi encontrado nenhum registro para os filtros informados!"
    >
      <template v-slot:cell(cadastrado_em)="row">
        <div>{{ row.item.cadastrado_em | maskDataDataHora}}</div>
      </template>
      <template v-slot:cell(selecionado)="row">
        <template v-if="row.item.selecionado">
          <b-icon icon="whatsapp" scale="1.6" variant="success"></b-icon>
        </template>
        <template v-else>
          <b-icon icon="whatsapp" scale="1.6" variant="danger"></b-icon>
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "WppTableClientes",
  data() {
    return {
      perPage: 30,
      pageOptions: [10, 30, 50, 100, 200, 400],
      currentPage: 1,
      filter: null,
      totalRowsTable: 0,
    };
  },
  props: {
    dataCadastros: Array,
    fields: Array,
    filterOn: Array,
    filterIgnored: Array,
    totalRows: Number,
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRowsTable = filteredItems.length;
      this.currentPage = 1;
    },
    onRowSelected(item) {
      /* Valida se já foi adicionado */
      if (this.dataCadastros[this.dataCadastros.indexOf(item)].selecionado) {
        this.dataCadastros[
          this.dataCadastros.indexOf(item)
        ].selecionado = false;
      } else {
        this.dataCadastros[this.dataCadastros.indexOf(item)].selecionado = true;
      }
    },
    selectAllRows() {
      for (let index = 0; index < this.dataCadastros.length; index++) {
        this.dataCadastros[index].selecionado = true;
      }
    },
    clearSelected() {
      for (let index = 0; index < this.dataCadastros.length; index++) {
        this.dataCadastros[index].selecionado = false;
      }
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
    this.$root.$off("filtrarClientesCampanha", this.fn);
    this.$root.$on("filtrarClientesCampanha", (filter) => {
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
</style>