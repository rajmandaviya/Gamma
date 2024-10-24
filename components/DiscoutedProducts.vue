<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5"
  >
    <h2 class="text-2xl font-bold mb-4">{{ t("Reduceri irezistibile") }}!</h2>

    <!-- Banner Section with Skeleton -->
    <div class="rounded-2xl overflow-hidden mb-4">
      <Skeleton
        v-if="loading || !computedBanner1Url"
        class="h-[200px] w-full md:h-[260px]"
      />
      <img
        v-else
        :src="computedBanner1Url"
        alt="Reduceri de Nerefuzat!"
        class="h-[200px] object-cover w-full md:h-[260px]"
      />
    </div>

    <!-- Products Section -->
    <div class="grid grid-cols-1 gap-4 mt-14">
      <Carousel>
        <CarouselPrevious class="absolute left-0 -top-7" />
        <CarouselNext class="absolute right-0 -top-7" />
        <CarouselContent>
          <CarouselItem
            v-for="(product, index) in displayProducts"
            :key="index"
            class="md:basis-1/2 lg:basis-1/3 xl:basis-1/5"
          >
            <ProductCardSmall :product="product" :loading="loading" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFetch } from "#imports";
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

const displayProducts = computed(() => {
  return props.loading ? Array(5).fill({}) : props.products;
});

const banner1Url = ref(null);

const { data: bannerData, error } = await useFetch("/api/marketingDesign");

if (error.value) {
  console.error("Error fetching banner data:", error.value);
}

const computedBanner1Url = computed(() => {
  if (bannerData.value?.success && bannerData.value.data?.length) {
    const marketingData = bannerData.value.data[0];
    if (locale.value === "ro") {
      return marketingData.Banner1_RO_[0];
    } else if (locale.value === "ru") {
      return marketingData.Banner1_RU_[0];
    }
  }
  return null;
});
</script>
