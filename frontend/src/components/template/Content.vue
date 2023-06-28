<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Content",
};
</script>

<style>
.content {
  display: flex;
  grid-area: content;
  background-color: rgb(254, 254, 254);
  max-height: 100vh;
  border: solid 5px rgb(247, 247, 247);
}
</style>