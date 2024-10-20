<template>
  <div>
    <h1>Subcategory: {{ subcategorySlug }}</h1>
    <Carousel
      class="relative w-full px-10 py-8"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent class="p-8">
        <CarouselItem
          v-for="subSubcategory in subSubCategories"
          :key="subSubcategory.id"
          class="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
        >
          <SubSubCategoryCard
            :sub-sub-category="subSubcategory"
            :key="subSubcategory.id"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute -left-2" />
      <CarouselNext class="absolute -right-2" />
    </Carousel>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import SubSubCategoryCard from "~/components/SubSubCategoryCard.vue";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
