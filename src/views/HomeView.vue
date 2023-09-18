<template>
  <div class="home">
    <AppComponent></AppComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AppComponent from "../components/App/index.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    AppComponent,
  },
});
</script>
