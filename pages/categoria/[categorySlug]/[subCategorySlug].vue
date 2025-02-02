<template>
  <div>
    <h1 class="text-2xl font-bold mt-6">
      {{ subcategoryName }}
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
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import SubSubCategoryCard from "~/components/SubSubCategoryCard.vue";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";

const subSubCategories = ref([]);
const subcategoryNames = ref({});
const products = ref([])
const route = useRoute();
const subcategorySlug = route.params.subCategorySlug;
const { locale } = useI18n();

const formatCategoryName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const subcategoryName = computed(() => {
  if (locale.value === "ro") {
    return (
      subcategoryNames.value.Nume_SubCategorie_RO ||
      formatCategoryName(subcategorySlug.split("_")[0])
    );
  } else if (locale.value === "ru") {
    return (
      subcategoryNames.value.Nume_SubCategorie_RU ||
      formatCategoryName(subcategorySlug.split("_")[0])
    );
  }
  return formatCategoryName(subcategorySlug.split("_")[0]);
});

// Fetch subcategory names
const subcategoryId = subcategorySlug.split("_")[1];
const fetchSubcategoryNames = async () => {
  const { data, error } = await useFetch(
    `/api/catNames/subcat?id=${subcategoryId}`
  );
  if (error.value) {
    console.error("Error fetching subcategory names:", error.value);
  } else {
    subcategoryNames.value = data.value;
  }
};

// Fetch sub-subcategories
const fetchSubSubCategories = async () => {
  const { data } = await useFetch(
    `/api/subCategories?categoryId=${route.params.categorySlug.split("_")[1]}`
  );
  let res = data.value.data.filter(
    (s) => s.id === Number(subcategorySlug.split("_")[1])
  );
  subSubCategories.value = res[0].subSubcategories;
};

// Fetch data
await Promise.all([fetchSubcategoryNames(), fetchSubSubCategories()]);

const fetchProducts = async () => {
    const res = await axios.get(`/api/productsBySubCategoryId?id=${subcategoryId}`)
    if (res?.data?.success){
        products.value = res?.data?.products
    }
}

onMounted(()=>{
    fetchProducts()
})

</script>
