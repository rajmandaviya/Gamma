<template>
  <div>
    <h1>Subcategory: {{ subcategorySlug }}</h1>
    <ul
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
    >
      <li v-for="subSubcategory in subSubCategories" class="">
        <SubSubCategoryCard
          :sub-sub-category="subSubcategory"
          :key="subSubcategory.id"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import SubSubCategoryCard from "~/components/SubSubCategoryCard.vue";
const subSubCategories = ref([]);

const route = useRoute();
const subcategorySlug = route.params.subCategorySlug;

const { data } = await useFetch(
  `/api/subCategories?categoryId=${route.params.categorySlug.split("_")[1]}`
);
let res = data.value.data.filter(
  (s) => s.id === Number(subcategorySlug.split("_")[1])
);
subSubCategories.value = res[0].subSubcategories;
</script>

<style scoped>
/* Add styles */
</style>
