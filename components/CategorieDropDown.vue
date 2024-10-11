<template>
  <div class="relative hidden lg:block">
    <!-- Button to toggle dropdown -->
    <button
      :class="{ 'cursor-default': isHomePage, 'cursor-pointer': !isHomePage }"
      class="bg-accent px-4 flex py-2 items-center w-[315px] justify-between gap-5"
      @click="toggleDropdown"
    >
      <UIcon name="i-ph:dots-nine-bold" class="mr-2" size="23" />
      <p>{{ t("Toate categoriile") }}</p>
      <UIcon name="i-ph:caret-down-bold" class="ml-2" size="20" />
    </button>

    <!-- Dropdown menu with transition -->
    <div
      v-if="isDropdownOpen"
      class="dropdown-menu absolute flex dark:bg-charade-950 border-t-0 bg-white border rounded-b-xl border-accent dark:border-accentz-10 overflow-hidden z-10"
      :style="{ height: `${dropdownHeight}px`, opacity: dropdownOpacity }"
    >
      <ul class="categories w-[313px]">
        <!-- Iterate over all categories -->
        <li
          v-for="category in categories"
          :key="category.id"
          class="px-4 py-[6px] cursor-pointer dark:hover:bg-gray-500 hover:bg-gray-100 flex items-center justify-between relative"
        >
          <NuxtLink
            :to="
              localePath({
                name: 'categoria-id',
                params: { id: createSlug(category) }, // Use only Nume_Categorie_RO to create the slug
              })
            "
            class="flex justify-between w-full"
            active-class="hovered-accent"
          >
            <div class="flex items-center">
              <UIcon :name="`i-ph:${category.Icons}`" size="23" class="mr-4" />
              {{ getCategoryName(category) }}
            </div>
            <UIcon name="i-ph:caret-right" class="ml-2" size="20" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import slugify from "slugify";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const categories = ref([]);
const isDropdownOpen = ref(false);
const isHomePage = ref(false);
const dropdownHeight = ref(0);
const dropdownOpacity = ref(0); // To handle smooth opacity transitions
const route = useRoute();
const router = useRouter();

// Function to fetch categories immediately during load
const fetchCategories = async () => {
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
};

// Function to calculate the height of the dropdown
const calculateDropdownHeight = () => {
  const dropdownMenu = document.querySelector(".categories");
  if (dropdownMenu) {
    dropdownHeight.value = dropdownMenu.scrollHeight;
  }
};

// Function to toggle the dropdown open/close with animation
const toggleDropdown = () => {
  // Allow toggling if it's not the homepage
  if (!isHomePage.value) {
    if (isDropdownOpen.value) {
      dropdownHeight.value = 0;
      dropdownOpacity.value = 0;
      setTimeout(() => {
        isDropdownOpen.value = false;
      }, 300); // Delay to allow the animation to complete
    } else {
      isDropdownOpen.value = true;
      nextTick(() => {
        calculateDropdownHeight();
        dropdownOpacity.value = 1; // Smooth opacity transition
      });
    }
  }
};

// Watch for locale changes and adjust the URL slug
watch(locale, (newLocale) => {
  const categoryId = route.params.id;
  const category = categories.value.find(
    (cat) => createSlug(cat) === categoryId
  );

  if (category) {
    const newSlug = createSlug(category); // Always use Nume_Categorie_RO
    if (categoryId !== newSlug) {
      router.push({
        name: "categoria-id",
        params: { id: newSlug },
      });
    }
  }
});

// On component mount
onMounted(async () => {
  await fetchCategories();

  if (route.path === "/" || route.path === "/ru") {
    isHomePage.value = true; // Mark as homepage
    isDropdownOpen.value = true; // Open dropdown by default on homepage
    nextTick(() => {
      calculateDropdownHeight();
      dropdownOpacity.value = 1; // Ensure smooth animation
    });
  } else {
    isHomePage.value = false;
    isDropdownOpen.value = false; // Close the dropdown if not on the homepage
  }
});

// Watch for route changes and adjust dropdown
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/" || newPath === "/ru") {
      isHomePage.value = true;
      isDropdownOpen.value = true; // Always open on homepage
      nextTick(() => {
        calculateDropdownHeight();
        dropdownOpacity.value = 1;
      });
    } else {
      isHomePage.value = false;
      isDropdownOpen.value = false; // Close dropdown when leaving homepage
      dropdownHeight.value = 0;
      dropdownOpacity.value = 0;
    }
  }
);

// Get the appropriate category name based on the current language
const getCategoryName = (category) => {
  return locale.value === "ru"
    ? category.Nume_Categorie_RU
    : category.Nume_Categorie_RO;
};

// Use the `slugify` package to create a slug for the URL using only Nume_Categorie_RO
const createSlug = (category) => {
  return slugify(category.Nume_Categorie_RO, {
    replacement: "-", // Replace spaces with hyphens
    lower: true, // Convert the text to lowercase
    strict: true, // Remove special characters
  }).toLowerCase(); // Force everything to be lowercase
};
</script>

<style scoped>
.dropdown-menu {
  transition: height 0.3s ease, opacity 0.3s ease; /* Smooth transition */
  height: 0;
  opacity: 0;
}
</style>
