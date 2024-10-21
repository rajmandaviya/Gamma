<template>
  <div>
    <h1>Category: {{ categoryId[0] }}</h1>

    <Carousel
      class="relative w-full px-8 py-8"
      :opts="{
        align: 'start',
      }"
    >
      <CarouselContent class="p-8">
        <CarouselItem
          v-for="subcategory in subcategories.data"
          :key="subcategory.id"
          class="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
        >
          <SubCategoryCard
            :categoryId="categoryId[1]"
            :subcategory="subcategory"
            :key="subcategory.id"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute -left-2" />
      <CarouselNext class="absolute -right-2" />
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
