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
      <CarouselPrevious class="absolute -left-10" />
      <CarouselNext class="absolute -right-10" />
    </Carousel>
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

const subSubCategories = ref([]);
const subcategoryNames = ref({});

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
const fetchSubcategoryNames = async () => {
  const subcategoryId = subcategorySlug.split("_")[1];
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
</script>
