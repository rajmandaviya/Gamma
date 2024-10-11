<template>
  <div class="h-full">
    <!-- Main Carousel -->
    <Carousel
      id="gallery"
      :items-to-show="1"
      :wrap-around="false"
      v-model="currentSlide"
    >
      <Slide v-for="(image, index) in images" :key="index">
        <div
          class="carousel__item border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
        >
          <img
            :src="image"
            alt="Product Image"
            class="object-cover w-full h-full"
          />
        </div>
      </Slide>
    </Carousel>

    <!-- Thumbnails Carousel -->
    <Carousel
      id="thumbnails"
      :items-to-show="4"
      :wrap-around="true"
      v-model="currentSlide"
      ref="carousel"
      class="mt-4"
    >
      <Slide v-for="(image, index) in images" :key="index">
        <div
          class="carousel__item cursor-pointer border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden m-1"
          @click="slideTo(index)"
        >
          <img
            :src="image"
            alt="Thumbnail Image"
            class="object-cover w-full h-full"
          />
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Carousel, Slide } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  name: "Gallery",
  components: {
    Carousel,
    Slide,
  },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    currentSlide: 0,
  }),
  methods: {
    slideTo(val) {
      this.currentSlide = val;
    },
  },
});
</script>

<style scoped>
/* For square images in both carousels */
.carousel__item {
  width: 100%;
  padding-top: 100%; /* This ensures a square aspect ratio */
  position: relative;
}

.carousel__item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-cover: cover;
}

#thumbnails .carousel__item {
  padding-top: 100%;
}
</style>
