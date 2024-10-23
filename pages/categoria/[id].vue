<template>
  <div>
    <h1 class="text-3xl font-bold mt-6">
      {{ formatCategoryName(categoryId[0]) }}
    </h1>

    <Carousel
      class="relative w-full px-0 py-8"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent class="p-0">
        <CarouselItem
          v-for="subcategory in subcategories.data"
          :key="subcategory.id"
          class="md:basis-1/2 lg:basis-1/3 xl:basis-1/6"
        >
          <SubCategoryCard
            :categoryId="categoryId[1]"
            :subcategory="subcategory"
            :key="subcategory.id"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute -left-10" />
      <CarouselNext class="absolute -right-10" />
    </Carousel>
  </div>
</template>

<script setup>
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ref } from "vue";
import { useRoute } from "vue-router";

const subcategories = ref([]);

const route = useRoute();
const categoryId = route.params.id.split("_");

console.log(categoryId);

const formatCategoryName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const { data } = await useFetch(
  `/api/subCategories?categoryId=${categoryId[1]}`
);
subcategories.value = data.value;
</script>
