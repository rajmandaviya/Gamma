<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAsyncData } from "#imports";

// Define the interface for slider data
interface SliderData {
  Bannere_Slider_RU_: string[];
  Bannere_Slider_RO_: string[];
}

// Store slider images
const items = ref<string[]>([]); // Holds the images to display in the carousel
const loading = ref(true); // Add loading state

const route = useRoute(); // Get the current route

// Function to determine and display appropriate slider based on locale
const displaySliders = (sliderData: SliderData[], locale: string) => {
  const slider = sliderData[0]; // Assuming there's only one slider set in the response
  if (locale === "ru") {
    items.value = slider.Bannere_Slider_RU_; // Set RU slider images
  } else {
    items.value = slider.Bannere_Slider_RO_; // Set RO slider images
  }
  loading.value = false; // Set loading to false after images are loaded
};

// Fetch all sliders and render the correct one based on locale
const fetchSliders = async () => {
  loading.value = true; // Set loading to true before fetching
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
    loading.value = false; // Set loading to false if there's an error
  }
};

// Watch for locale changes and refetch the sliders when the route changes
watch(
  () => route.fullPath,
  () => {
    fetchSliders();
  },
  { immediate: true }
);

// Fetch sliders on component mount
onMounted(() => {
  fetchSliders();
});
</script>

<template>
  <USkeleton
    v-if="loading"
    class="h-[250px] md:h-[350px] lg:h-[515px] rounded-lg"
  />
  <UCarousel
    v-else
    v-slot="{ item }"
    :items="items"
    :ui="{ item: 'basis-full' }"
    class="rounded-lg overflow-hidden"
    arrows
  >
    <img
      :src="item"
      class="w-full h-[250px] md:h-[350px] lg:h-[515px] object-cover"
      draggable="false"
    />
  </UCarousel>
</template>
