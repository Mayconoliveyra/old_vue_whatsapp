<template>
  <div class="main-titulo-cadastro">
    <div class="titulo-cadastro">
      <div>
        <b-icon class="mr-1 ml-2" :icon="icone" scale="1.8"></b-icon>
        <span class="text-title">{{ titulo }}</span>
      </div>

      <button
        class="salvar"
        v-if="mode != 'save' && permissaoCadastrar"
        @click="$emit('criarNovoCadastro')"
      >Adicionar</button>
      <div v-if="mode == 'save'">
        <button
          v-if="permissaoAlterar && permissaoExcluir && Boolean(!campanha.confirmado_em)"
          class="desativar"
          @click="$emit('excluirRegistro')"
        >Excluir</button>
        <button class="cancelar" @click="$emit('cancelarCadastro')">Cancelar</button>
        <button
          v-if="permissaoAlterar && Boolean(!campanha.confirmado_em)"
          class="salvar"
          @click="$emit('salvarRegistro')"
        >Atualizar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WppTituloCadastro",
  props: [
    "titulo",
    "campanha",
    "mode",
    "permissaoCadastrar",
    "permissaoAlterar",
    "permissaoExcluir",
    "icone",
  ],
  emits: [
    "salvarRegistro",
    "criarNovoCadastro",
    "cancelarCadastro",
    "excluirRegistro",
  ],
};
</script>

<style scoped>
.main-titulo-cadastro {
  background-color: rgb(255, 255, 255);
  padding: 5px 5px 7px 5px;
}
.titulo-cadastro {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: solid 1px rgba(106, 106, 106, 0.2);
  width: 100%;
  padding: 6px;
  border-radius: 5px;
}

.titulo-cadastro .text-title {
  font-size: 14px;
  padding-left: 7px;
  letter-spacing: 2px;
  color: #000000;
  text-transform: uppercase;
  font-weight: 900;
}
.titulo-cadastro button {
  padding: 3px 10px;
  border-radius: 4px;
  width: 120px;
  color: #ffffff;
  font-size: 14px;
  margin-left: 3px;
  letter-spacing: 1px;
}
.salvar {
  background-color: #00a65a;
  border-color: #008d4c;
}
.cancelar {
  background-color: #f39c12;
  border-color: #e08e0b;
}
.desativar {
  background-color: #f56954;
  border-color: #f4543c;
}
</style>