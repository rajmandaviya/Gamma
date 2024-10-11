<template>
  <h1>Subsubcategory: {{ subsubcategoryId }}</h1>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const subsubcategoryId = route.params.subsubcategorySlug;
</script>

<style scoped></style>
