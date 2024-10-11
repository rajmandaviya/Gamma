<template>
  <ul class="categories w-[313px]">
    <!-- Iterate over all categories -->
    <li
      v-for="category in categories"
      :key="category.id"
      class="px-4 py-[6px] cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-100 flex items-center justify-between relative"
    >
      <NuxtLink
        :to="{
          name: 'categoria-id',
          params: { id: createSlug(category.Nume_Categorie_RO) }, // Slug is always based on RO name
        }"
        class="flex justify-between w-full"
        active-class="hovered-accent"
      >
        <div class="flex items-center">
          <UIcon :name="`i-ph:${category.Icons}`" size="23" class="mr-4" />
          {{ getCategoryName(category) }}
          <!-- Display category name based on locale -->
        </div>
        <UIcon name="i-ph:caret-right" class="ml-2" size="20" />
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import slugify from "slugify";

const { locale } = useI18n();
const categories = ref([]);

// Fetch categories on component mount using fetch
onMounted(async () => {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    categories.value = data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

// Get the appropriate category name based on the current language
const getCategoryName = (category) => {
  // Display category name in Russian if the locale is Romanian, as per your request
  return locale.value === "ro"
    ? category.Nume_Categorie_RU
    : category.Nume_Categorie_RO;
};

// Use the `slugify` package to create a slug for the URL based on the Romanian category name only
const createSlug = (text) => {
  return slugify(text, {
    replacement: "-", // Replace spaces with hyphens
    lower: true, // Convert the text to lowercase
    strict: true, // Remove special characters
  }).toLowerCase();
};
</script>
