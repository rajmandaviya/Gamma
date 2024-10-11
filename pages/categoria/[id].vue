<template>
  <div>
    <h1>Category: {{ categoryId }}</h1>
    <!-- Render subcategories -->
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

// Get the first level categoryId from the route
const route = useRoute();
const categoryId = route.params.id; // No need to rename this
</script>

<style scoped>
/* Add styles */
</style>
