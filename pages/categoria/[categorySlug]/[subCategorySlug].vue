<template>
  <div>
    <h1>Subcategory: {{ subcategorySlug }}</h1>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const subcategorySlug = route.params.subCategorySlug;
</script>

<style scoped>
/* Add styles */
</style>
