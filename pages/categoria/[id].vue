<template>
  <div>
    <h1>Category: {{ categoryId[0] }}</h1>
    <!-- Render subcategories -->
    <ul
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
    >
      <li v-for="subcategory in subcategories.data" class="">
        <SubCategoryCard
          :categoryId="categoryId[1]"
          :subcategory="subcategory"
          :key="subcategory.id"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const subcategories = ref([]);

// Get the first level categoryId from the route
const route = useRoute();
const categoryId = route.params.id.split("_");

const { data } = await useFetch(
  `/api/subCategories?categoryId=${categoryId[1]}`
);
subcategories.value = data.value;
</script>

<style scoped>
/* Add styles */
</style>
