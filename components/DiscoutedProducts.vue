<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5"
  >
    <h2 class="text-2xl font-bold mb-4">{{ t("Reduceri irezistibile") }}!</h2>
    <div class="rounded-2xl overflow-hidden mb-4">
      <!-- Display the banner image -->
      <img
        :src="computedBanner1Url"
        alt="Reduceri de Nerefuzat!"
        v-if="computedBanner1Url"
        class="h-[200px] object-cover w-full md:h-[260px]"
      />
    </div>
    <div class="grid grid-cols-1 gap-4 mt-14">
      <Carousel>
        <CarouselPrevious class="absolute left-0 -top-7" />
        <CarouselNext class="absolute right-0 -top-7" />
        <CarouselContent>
          <CarouselItem
            v-for="(product, index) in products"
            :key="index"
            class="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
          >
            <ProductCardSmall :product="product" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";
import { useI18n } from "vue-i18n";
import { useFetch } from "#imports";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const { t, locale } = useI18n();

const props = defineProps({
  products: Array,
});

const products = props.products;
const banner1Url = ref(null);

// Use useFetch to get the banner data based on the locale
const { data: bannerData, error } = await useFetch("/api/marketingDesign");

if (error.value) {
  console.error("Error fetching banner data:", error.value);
}

// Compute the appropriate banner URL based on locale
const computedBanner1Url = computed(() => {
  if (bannerData.value?.success && bannerData.value.data?.length) {
    const marketingData = bannerData.value.data[0];
    if (locale.value === "ro") {
      return marketingData.Banner1_RO_[0]; // Romanian banner
    } else if (locale.value === "ru") {
      return marketingData.Banner1_RU_[0]; // Russian banner
    }
  }
  return null;
});
</script>
