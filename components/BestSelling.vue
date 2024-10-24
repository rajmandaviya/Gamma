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
        <Carousel v-if="!loading && displayProducts.length > 0">
          <CarouselContent>
            <CarouselItem
              v-for="(product, index) in displayProducts"
              :key="index"
              class="md:basis-1/2 lg:basis-1/2 xl:basis-1/3"
            >
              <ProductCardSmall :product="product" :loading="false" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="absolute left-0 -top-7" />
          <CarouselNext class="absolute right-0 -top-7" />
        </Carousel>
        <div
          v-else-if="loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <Skeleton
            v-for="i in 3"
            :key="i"
            class="h-[300px] w-full rounded-xl"
          />
        </div>
        <p v-else class="text-center text-gray-500">
          {{ t("No products available") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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
const banner2Url = ref(null);
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
  return props.products;
});

async function fetchBanner2() {
  try {
    const response = await fetch("/api/marketingDesign");
    const data = await response.json();
    if (data.success && data.data.length > 0) {
      if (locale.value === "ro") {
        banner2Url.value = data.data[0].Banner2_RO_[0];
      } else if (locale.value === "ru") {
        banner2Url.value = data.data[0].Banner2_RU_[0];
      }
    }
  } catch (error) {
    console.error("Error fetching Banner2 data:", error);
  }
}

onMounted(() => {
  fetchBanner2();
});
</script>
