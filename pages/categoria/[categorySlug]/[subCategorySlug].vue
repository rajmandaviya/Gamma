<template>
  <div>
    <h1 class="text-2xl font-bold mt-6">
      {{ formatCategoryName(subcategorySlug.split("_")[0]) }}
    </h1>
    <Carousel
      class="relative w-full px-0 py-8"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent class="p-0">
        <CarouselItem
          v-for="subSubcategory in subSubCategories"
          :key="subSubcategory.id"
          class="md:basis-1/2 lg:basis-1/3 xl:basis-1/6"
        >
          <SubSubCategoryCard
            :sub-sub-category="subSubcategory"
            :key="subSubcategory.id"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute -left-10" />
      <CarouselNext class="absolute -right-10" />
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

const formatCategoryName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const { data } = await useFetch(
  `/api/subCategories?categoryId=${route.params.categorySlug.split("_")[1]}`
);
let res = data.value.data.filter(
  (s) => s.id === Number(subcategorySlug.split("_")[1])
);
subSubCategories.value = res[0].subSubcategories;
</script>
