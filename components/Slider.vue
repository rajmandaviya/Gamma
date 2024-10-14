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

const route = useRoute(); // Get the current route

// Function to determine and display appropriate slider based on locale
const displaySliders = (sliderData: SliderData[], locale: string) => {
  const slider = sliderData[0]; // Assuming there's only one slider set in the response
  if (locale === "ru") {
    items.value = slider.Bannere_Slider_RU_; // Set RU slider images
  } else {
    items.value = slider.Bannere_Slider_RO_; // Set RO slider images
  }
};

// Fetch all sliders and render the correct one based on locale
const fetchSliders = async () => {
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
  <UCarousel
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
