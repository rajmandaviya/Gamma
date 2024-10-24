<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAsyncData } from "#imports";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SliderData {
  Bannere_Slider_RU_: string[];
  Bannere_Slider_RO_: string[];
}

const items = ref<string[]>([]);
const loading = ref(true);
const imagesLoaded = ref<boolean[]>([]);

const route = useRoute();

const displaySliders = (sliderData: SliderData[], locale: string) => {
  const slider = sliderData[0];
  if (locale === "ru") {
    items.value = slider.Bannere_Slider_RU_;
  } else {
    items.value = slider.Bannere_Slider_RO_;
  }
  imagesLoaded.value = new Array(items.value.length).fill(false);
  loading.value = false;
};

const handleImageLoad = (index: number) => {
  imagesLoaded.value[index] = true;
};

const fetchSliders = async () => {
  loading.value = true;
  const { data, error } = await useAsyncData("marketingDesign", () =>
    $fetch(`/api/marketingDesign`)
  );

  if (data?.value && data.value.success) {
    const locale: string = route.fullPath.includes("/ru") ? "ru" : "ro";
    displaySliders(data.value.data as SliderData[], locale);
  } else {
    console.error(
      "Error fetching sliders:",
      error?.value || "No sliders available"
    );
    loading.value = false;
  }
};

watch(
  () => route.fullPath,
  () => {
    fetchSliders();
  },
  { immediate: true }
);

onMounted(() => {
  fetchSliders();
});
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="relative w-full h-[250px] md:h-[350px] lg:h-[515px]"
    >
      <Skeleton class="absolute inset-0 rounded-lg" />
    </div>

    <!-- Loaded State -->
    <Carousel v-else class="rounded-lg overflow-hidden">
      <CarouselContent>
        <CarouselItem v-for="(item, index) in items" :key="index">
          <div class="relative w-full h-[250px] md:h-[350px] lg:h-[515px]">
            <!-- Skeleton while individual image loads -->
            <Skeleton
              v-if="!imagesLoaded[index]"
              class="absolute inset-0 rounded-lg"
            />
            <img
              :src="item"
              class="absolute inset-0 w-full h-full object-cover"
              draggable="false"
              alt="Slider image"
              @load="handleImageLoad(index)"
              :class="{ 'opacity-0': !imagesLoaded[index] }"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
</template>

<style scoped>
.opacity-0 {
  opacity: 0;
}

img {
  transition: opacity 0.2s ease-in-out;
}
</style>
