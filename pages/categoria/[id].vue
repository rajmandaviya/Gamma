<template>
  <div>
    <h1 class="text-3xl font-bold mt-6">
      {{ categoryName }}
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
          class="md:basis-1/3 lg:basis-1/3 xl:basis-1/6"
        >
          <SubCategoryCard
            :categoryId="categoryId[1]"
            :subcategory="subcategory"
            :key="subcategory.id"
          />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute -left-4 md:-left-10" />
      <CarouselNext class="absolute -right-4 md:-right-10" />
    </Carousel>
      <div class="grid grid-cols-12">
          <div class="col-span-3">
              <Filters></Filters>
          </div>
          <div class="col-span-9">
              <div v-for="product in products" class="inline-flex">
                  <ProductCardSmall :product="product" class="m-2"></ProductCardSmall>
              </div>
          </div>
      </div>

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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "axios";

const subcategories = ref([]);
const categoryNames = ref({});
const products = ref([])
const route = useRoute();
const categoryId = route.params.id.split("_");
const { locale } = useI18n();

console.log(categoryId);

const categoryName = computed(() => {
  if (locale.value === "ro") {
    return (
      categoryNames.value?.Nume_Categorie_RO || formatCategoryName(categoryId[0])
    );
  } else if (locale.value === "ru") {
    return (
      categoryNames.value.Nume_Categorie_RU || formatCategoryName(categoryId[0])
    );
  }
  return formatCategoryName(categoryId[0]);
});

const formatCategoryName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Fetch category names
const { data: catData } = await useFetch(
  `/api/catNames/cat?id=${categoryId[1]}`
);
categoryNames.value = catData.value;

// Fetch subcategories
const { data } = await useFetch(
  `/api/subCategories?categoryId=${categoryId[1]}`
);
subcategories.value = data.value;
const fetchProducts = async () => {
    const res = await axios.get(`/api/productsByCategoryId?id=${categoryId[1]}`)
    if (res?.data?.success){
        products.value = res?.data?.products
    }
}

onMounted(()=>{
    fetchProducts()
})


</script>
