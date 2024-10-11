<template>
  <div v-if="categories && categories.length">
    <ul>
      <li
        v-for="category in categories"
        :key="category.id"
        class="flex gap-2 my-2 justify-between items-center"
      >
        <!-- Uicon component with dynamic icon from API -->

        <!-- Nuxt link to category URL, generated using slug from Nume_Categorie_RU -->
        <nuxt-link
          :to="`/categoria/${createSlug(category.Nume_Categorie_RO)}`"
          class="text-xl flex items-center gap-5"
        >
          <UIcon :name="`i-ph:${category.Icons}`" size="30" />
          {{ getCategoryName(category) }}
        </nuxt-link>

        <UIcon name="i-ph:caret-right" />
      </li>
    </ul>
  </div>
  <div v-else>
    <!-- Optionally, display a loading or empty state -->
    Loading categories...
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch } from "#app";
import { useI18n } from "vue-i18n";
import slugify from "slugify"; // Make sure slugify is installed

// Categories ref to store fetched data
const categories = ref([]);

// Fetch the categories data from the API
const { data, pending, error } = await useFetch("/api/categories");

// Once the data is available, update the categories ref
if (data.value && data.value.success) {
  categories.value = data.value.data;
}

// Get locale from vue-i18n
const { locale } = useI18n();

// Function to get category name based on locale
const getCategoryName = (category) => {
  return locale.value === "ru"
    ? category.Nume_Categorie_RU
    : category.Nume_Categorie_RO;
};

// Function to create slug from the Russian category name
const createSlug = (text) => {
  return slugify(text, {
    replacement: "-", // Replace spaces with hyphens
    lower: true, // Convert the text to lowercase
    strict: true, // Remove special characters
    locale: "ru", // Always use Russian locale for URL slugs
  }).toLowerCase(); // Ensure the slug is always lowercase
};
</script>
