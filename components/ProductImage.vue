<script setup lang="ts">
import { ref, watch } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { watchOnce } from "@vueuse/core";

const props = defineProps({
  product: { type: Object, required: true, default: {} },
  productVariant: { required: true },
});
const { product, productVariant } = props;

const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);

const image = ref(product?.Imagine_Principala?.[0] || "");
const imagesLoaded = ref(false);

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap());
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  emblaMainApi.value.scrollTo(index);
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return;

  onSelect();
  emblaMainApi.on("select", onSelect);
  emblaMainApi.on("reInit", onSelect);
});

watch(
  () => productVariant,
  (newProductVariant) => {
    if (newProductVariant && typeof newProductVariant === "object") {
      if (
        "Imagini" in newProductVariant &&
        Array.isArray(newProductVariant.Imagini)
      ) {
        image.value = newProductVariant.Imagini[0] || "";
        return;
      }
    }
    image.value = product?.Imagine_Principala?.[0] || "";
  },
  { deep: true, immediate: true }
);

function onAllImagesLoaded() {
  imagesLoaded.value = true;
}

function checkImagesLoaded() {
  const images = document.querySelectorAll("img");
  let loadedCount = 0;
  images.forEach((img) => {
    if (img.complete) loadedCount++;
  });
  if (loadedCount === images.length) {
    onAllImagesLoaded();
  }
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <!-- Main Carousel -->
    <Carousel
      class="w-full sm:max-w-xl mx-auto mb-4"
      @init-api="(val) => (emblaMainApi = val)"
    >
      <CarouselContent>
        <CarouselItem>
          <Card
            class="bg-white dark:bg-charade-950 border-gray-200 dark:border-charade-700"
          >
            <CardContent class="relative aspect-square p-0">
              <div class="w-full h-full">
                <Skeleton
                  v-if="!imagesLoaded"
                  class="w-full h-full rounded-lg"
                />
                <img
                  :src="image"
                  alt="Main Product Image"
                  class="h-full w-full object-cover rounded-lg"
                  @load="checkImagesLoaded"
                  :class="{ hidden: !imagesLoaded }"
                />
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem
          v-for="(item, index) in product?.imagini_Secundare"
          :key="index"
        >
          <Card
            class="bg-white dark:bg-charade-950 border-gray-200 dark:border-charade-700"
          >
            <CardContent class="relative aspect-square p-0">
              <div class="w-full h-full">
                <Skeleton
                  v-if="!imagesLoaded"
                  class="w-full h-full rounded-lg"
                />
                <img
                  :src="item"
                  alt=""
                  class="h-full w-full object-cover rounded-lg"
                  @load="checkImagesLoaded"
                  :class="{ hidden: !imagesLoaded }"
                />
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="hidden sm:flex" />
      <CarouselNext class="hidden sm:flex" />
    </Carousel>

    <!-- Thumbnail Carousel -->
    <Carousel
      class="w-full sm:max-w-xl mx-auto"
      @init-api="(val) => (emblaThumbnailApi = val)"
    >
      <CarouselContent class="flex gap-2">
        <CarouselItem
          class="basis-1/4 min-w-0 cursor-pointer pl-0"
          @click="onThumbClick(0)"
        >
          <div :class="[0 === selectedIndex ? 'opacity-100' : 'opacity-50']">
            <Card
              class="bg-white dark:bg-charade-950 border-gray-200 dark:border-charade-700"
            >
              <CardContent class="relative aspect-square p-2">
                <div class="w-full h-full">
                  <Skeleton
                    v-if="!imagesLoaded"
                    class="w-full h-full rounded-lg"
                  />
                  <img
                    :src="image"
                    alt="Main Product Image Thumbnail"
                    class="h-full w-full object-cover rounded-lg"
                    @load="checkImagesLoaded"
                    :class="{ hidden: !imagesLoaded }"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem
          v-for="(item, index) in product?.imagini_Secundare"
          :key="index"
          class="basis-1/4 min-w-0 cursor-pointer pl-0"
          @click="onThumbClick(index + 1)"
        >
          <div
            :class="[
              index + 1 === selectedIndex ? 'opacity-100' : 'opacity-50',
            ]"
          >
            <Card
              class="bg-white dark:bg-charade-950 border-gray-200 dark:border-charade-700"
            >
              <CardContent class="relative aspect-square p-2">
                <div class="w-full h-full">
                  <Skeleton
                    v-if="!imagesLoaded"
                    class="w-full h-full rounded-lg"
                  />
                  <img
                    :src="item"
                    alt=""
                    class="h-full w-full object-cover rounded-lg"
                    @load="checkImagesLoaded"
                    :class="{ hidden: !imagesLoaded }"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</template>
