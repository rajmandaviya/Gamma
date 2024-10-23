<template>
  <div class="mt-10 mb-12">
    <div class="flex mb-10 justify-center">
      <h1 class="text-4xl font-bold text-center">{{ t("Top Categories") }}</h1>
    </div>
    <Carousel>
      <CarouselContent class="w-[80%]">
        <template v-if="isLoading">
          <CarouselItem
            v-for="n in 4"
            :key="n"
            class="md:basis-1/2 lg:basis-1/3 xl:basis-1/3 ml-12"
          >
            <div
              class="flex p-4 justify-between dark:bg-charade-800 border border-charade-900 bg-charade-950 w-[340px] h-[110px] rounded-xl shrink-0"
            >
              <div class="flex flex-col justify-between flex-1 mr-4">
                <div>
                  <USkeleton class="h-4 w-20 mb-2" />
                  <USkeleton class="h-6 w-32 mb-2" />
                </div>
                <USkeleton class="h-[1px] w-20" />
              </div>
              <USkeleton class="w-20 h-20 rounded-lg" />
            </div>
          </CarouselItem>
        </template>
        <template v-else>
          <CarouselItem
            v-for="category in topCategories"
            :key="category.id"
            class="md:basis-1/2 lg:basis-1/2 xl:basis-1/3 ml-12"
          >
            <div
              @click="navigateToCategory(category)"
              class="flex p-4 justify-between cursor-pointer dark:bg-charade-800 border border-charade-900 hover:border-accent bg-charade-950 w-[340px] h-[110px] rounded-xl shrink-0"
            >
              <div>
                <p class="text-white text-sm mb-2">{{ t("Category") }}</p>
                <p class="text-white text-[16px] mb-2">
                  {{ locale === "ru" ? category.nameRu : category.nameRo }}
                </p>
                <div class="w-20 h-[1px] bg-white"></div>
              </div>
              <img
                :src="category.imagePath"
                :alt="locale === 'ru' ? category.nameRu : category.nameRo"
                class="w-20 h-20 rounded-lg object-cover"
              />
            </div>
          </CarouselItem>
        </template>
      </CarouselContent>
    </Carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import slugify from "slugify";
const { t, locale } = useI18n();
const router = useRouter();

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const topCategories = ref([]);
const isLoading = ref(true);

const navigateToCategory = (category) => {
  if (!category.mainCategory) return;

  const mainCategorySlug = `${slugify(category.mainCategory.nameRo)}_${
    category.mainCategory.id
  }`;
  const subCategorySlug = `${slugify(category.nameRo)}_${category.id}`;
  const langPrefix = locale.value === "ru" ? "/ru" : "";
  const url = `${langPrefix}/categoria/${mainCategorySlug}/${subCategorySlug}`;
  router.push(url);
};

onMounted(async () => {
  try {
    const response = await fetch("/api/topCategory");
    const data = await response.json();
    if (data.success) {
      topCategories.value = data.categories;
    } else {
      console.error("Failed to fetch top categories:", data.error);
    }
  } catch (error) {
    console.error("Error fetching top categories:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
