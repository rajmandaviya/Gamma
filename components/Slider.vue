<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAsyncData } from "#imports";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const items = ref([]); // Store slider images
const route = useRoute(); // Access the current route

// Carousel settings and breakpoints
const settings = {
  itemsToShow: 1,
  snapAlign: "center",
};
const breakpoints = {
  700: {
    itemsToShow: 3.5,
    snapAlign: "center",
  },
  1024: {
    itemsToShow: 5,
    snapAlign: "start",
  },
};

// Function to display appropriate slider based on locale
const displaySliders = (sliderData, locale) => {
  const slider = sliderData[0]; // Assuming there's only one slider set in the response
  if (locale === "ru") {
    items.value = slider.Bannere_Slider_RU_; // Set RU slider images
  } else {
    items.value = slider.Bannere_Slider_RO_; // Set RO slider images
  }
};

// Fetch all sliders and display the appropriate one based on locale
const fetchSliders = async () => {
  const { data, error } = await useAsyncData("marketingDesign", () =>
    $fetch(`/api/marketingDesign`)
  );

  if (data?.value && data.value.success) {
    const locale = route.fullPath.includes("/ru") ? "ru" : "ro";
    displaySliders(data.value.data, locale);
  } else {
    console.error(
      "Error fetching sliders:",
      error?.value || "No sliders available"
    );
  }
};

// Watch for locale changes in the URL
watch(
  () => route.fullPath,
  (newPath) => {
    const locale = newPath.includes("/ru") ? "ru" : "ro";
    fetchSliders();
  },
  { immediate: true }
);

onMounted(() => {
  fetchSliders();
});
</script>

<template>
  <Carousel v-bind="settings" :breakpoints="breakpoints">
    <!-- Display each image as a slide -->
    <Slide v-for="(item, index) in items" :key="index">
      <img
        :src="item"
        class="w-full h-[250px] md:h-[350px] lg:h-[515px] object-cover"
        draggable="false"
      />
    </Slide>

    <!-- Addons for navigation and pagination -->
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
li.carousel__slide.carousel__slide--visible.carousel__slide--active {
  border-radius: 15px;
  overflow: hidden;
  width: 100% !important;
}
ol.carousel__pagination {
  display: none !important;
}
</style>
