<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5"
  >
    <div class="flex">
      <h2 class="text-2xl font-bold mb-4">
        {{ t("Descoperă produsele top") }}!
      </h2>
    </div>
    <div class="block lg:flex gap-4">
      <!-- Banner Skeleton/Image -->
      <Skeleton
        v-if="loading || !banner2Url"
        class="h-[300px] w-full lg:w-[400px] rounded-xl"
      />
      <img
        v-else
        :src="banner2Url"
        alt="Discounted"
        class="h-[300px] w-full lg:w-[400px] object-cover rounded-xl"
      />

      <!-- Products Section -->
      <div class="grid grid-cols-1 gap-4 mt-14 lg:mt-0">
        <Carousel>
          <CarouselContent>
            <CarouselItem
              v-for="(product, index) in displayProducts"
              :key="index"
              class="md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
            >
              <ProductCardSmall :product="product" :loading="loading" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="absolute left-0 -top-7" />
          <CarouselNext class="absolute right-0 -top-7" />
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const { t, locale } = useI18n();

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: true,
  },
});

// Modified to match the first component's loading behavior
const displayProducts = computed(() => {
  return props.loading ? Array(5).fill({}) : props.products;
});

const { data: bannerData, error } = await useFetch("/api/marketingDesign");

if (error.value) {
  console.error("Error fetching banner data:", error.value);
}

// Computing banner URL using the same pattern as the first component
const banner2Url = computed(() => {
  if (bannerData.value?.success && bannerData.value.data?.length) {
    const marketingData = bannerData.value.data[0];
    if (locale.value === "ro") {
      return marketingData.Banner2_RO_[0];
    } else if (locale.value === "ru") {
      return marketingData.Banner2_RU_[0];
    }
  }
  return null;
});
</script>
