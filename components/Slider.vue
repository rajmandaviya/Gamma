<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAsyncData } from "#imports";
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
const route = useRoute();

const displaySliders = (sliderData: SliderData[], locale: string) => {
  const slider = sliderData[0];
  items.value =
    locale === "ru" ? slider.Bannere_Slider_RU_ : slider.Bannere_Slider_RO_;
};

const fetchSliders = async () => {
  const { data } = await useAsyncData("marketingDesign", () =>
    $fetch(`/api/marketingDesign`)
  );

  if (data?.value?.success) {
    const locale: string = route.fullPath.includes("/ru") ? "ru" : "ro";
    displaySliders(data.value.data as SliderData[], locale);
  }
};

watch(() => route.fullPath, fetchSliders, { immediate: true });

onMounted(fetchSliders);
</script>

<template>
  <div class="w-full">
    <Carousel class="rounded-lg overflow-hidden">
      <CarouselContent>
        <CarouselItem v-for="(item, index) in items" :key="index">
          <div class="relative w-full h-[250px] md:h-[350px] lg:h-[515px]">
            <img
              :src="item"
              class="absolute inset-0 w-full h-full object-cover"
              draggable="false"
              alt="Slider image"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
</template>
