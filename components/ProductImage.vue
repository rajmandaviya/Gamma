<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
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

const props = defineProps({
  product: { type: Object, required: true, default: () => ({}) },
  productVariant: { required: true },
});
const { product, productVariant } = props;

const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);

const image = ref(product?.Imagine_Principala?.[0] || "");
const imagesLoaded = ref<Record<number, boolean>>({});
const allImages = ref<string[]>([]);
const carouselLoaded = ref(false);

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  emblaThumbnailApi.value.scrollTo(selectedIndex.value);
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value) return;
  emblaMainApi.value.scrollTo(index);
}
watch(
  () => productVariant,
  (newProductVariant) => {
      // RElOAD CASE
    if (newProductVariant && typeof newProductVariant === "object") {
      if (
        "Imagini" in newProductVariant &&
        Array.isArray(newProductVariant?.Imagini)
      ) {

        image.value = newProductVariant?.Imagini[0] || "";
        allImages.value = newProductVariant?.Imagini;
      } else {
        image.value = product?.Imagine_Principala?.[0] || "";
        allImages.value = [
          ...(product?.Imagine_Principala || []),
          ...(product?.imagini_Secundare || []),
        ];
      }
    } else {
      image.value = product?.Imagine_Principala?.[0] || "";
      allImages.value = [
        ...(product?.Imagine_Principala || []),
        ...(product?.imagini_Secundare || []),
      ];
    }

    // CHANGE CASE

      if (productVariant?.value){
          if (productVariant.value && typeof productVariant.value === "object") {
              if (
                  "Imagini" in productVariant.value &&
                  Array.isArray(productVariant.value?.Imagini)
              ) {

                  image.value = productVariant.value?.Imagini[0] || "";
                  allImages.value = productVariant.value?.Imagini;
              } else {
                  image.value = product?.Imagine_Principala?.[0] || "";
                  allImages.value = [
                      ...(product?.Imagine_Principala || []),
                      ...(product?.imagini_Secundare || []),
                  ];
              }
          } else {
              image.value = product?.Imagine_Principala?.[0] || "";
              allImages.value = [
                  ...(product?.Imagine_Principala || []),
                  ...(product?.imagini_Secundare || []),
              ];
          }
      }
    // imagesLoaded.value = {};
    // carouselLoaded.value = false;
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  if (emblaMainApi.value) {
    emblaMainApi.value.on("select", onSelect);
    emblaMainApi.value.on("reInit", onSelect);
    emblaMainApi.value.on("init", () => {
      carouselLoaded.value = true;
    });
  }
});

function onImageLoad(index: number) {
  imagesLoaded.value[index] = true;
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <!-- Main Carousel -->
    <Carousel class="mx-automb-4" @init-api="(api) => (emblaMainApi = api)">
      <CarouselContent>
        <CarouselItem
          v-for="(img, index) in allImages"
          :key="index"
          class="!duration-0 !transition-none"
        >
          <Card
            class="bg-white dark:bg-charade-950 border-gray-200 dark:border-charade-700 w-full aspect-square"
          >
            <CardContent class="relative p-0 h-full">
              <div class="w-full h-full">
                  <Skeleton class="h-96 w-full rounded-lg" v-if="!carouselLoaded || !imagesLoaded[index]" />
                <img
                  v-else
                  :src="img"
                  :alt="`Product Image ${index + 1}`"
                  class="product-image w-full h-full object-cover rounded-lg transition-opacity duration-300"
                  :class="{
                    'opacity-0': !carouselLoaded || !imagesLoaded[index],
                    'opacity-100': carouselLoaded && imagesLoaded[index],
                  }"
                  @load="onImageLoad(index)"
                />
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="hidden sm:flex" />
      <CarouselNext class="hidden sm:flex" />
    </Carousel>
    <Carousel
      class="w-full sm:max-w-xl mx-auto"
      @init-api="(api) => (emblaThumbnailApi = api)"
    >
      <CarouselContent class="flex gap-2">
        <CarouselItem
          v-for="(img, index) in allImages"
          :key="index"
          class="basis-1/4 min-w-0 cursor-pointer pl-0 !duration-0 !transition-none"
          @click="onThumbClick(index)"
        >
          <div
            :class="[index === selectedIndex ? 'opacity-100' : 'opacity-50']"
          >
            <Card
              class="bg-white dark:bg-charade-950 border-gray-200 dark:border-charade-700"
            >
              <CardContent class="relative aspect-square p-2">
                <div class="w-full h-full">
                  <Skeleton
                    v-show="!carouselLoaded || !imagesLoaded[index]"
                    class="w-full h-full rounded-lg absolute inset-0"
                  />
                  <img
                    :src="img"
                    :alt="`Thumbnail ${index + 1}`"
                    class="product-image w-full h-full object-cover rounded-lg transition-opacity duration-300"
                    :class="{
                      'opacity-0': !carouselLoaded || !imagesLoaded[index],
                      'opacity-100': carouselLoaded && imagesLoaded[index],
                    }"
                    @load="onImageLoad(index)"
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
