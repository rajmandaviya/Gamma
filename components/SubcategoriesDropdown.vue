<template>
  <div class="flex">
    <!-- Subcategories Section -->
    <div
      v-if="subcategories"
      class="columns-3 gap-4 p-2 w-[80%] overflow-y-auto"
    >
      <!-- Individual Subcategory Blocks -->
      <div
        v-for="subcategory in subcategories"
        :key="subcategory.id"
        class="break-inside-avoid p-3 bg-white dark:bg-[#3A3B4A] shadow-sm rounded-md mb-4"
      >
        <!-- Subcategory Title -->
        <h3 class="text-xl font-semibold">
          <NuxtLink
            :to="generateSubcategoryLink(subcategory)"
            class="cursor-pointer hover:text-accent"
          >
            {{ getSubcategoryName(subcategory) }}
          </NuxtLink>
        </h3>

        <!-- Subsubcategories List -->
        <ul>
          <li
            v-for="subsub in subcategory.subSubcategories"
            :key="subsub.id"
            class="text-gray-600 text-base dark:text-gray-300 my-1"
          >
            <NuxtLink
              :to="generateSubsubcategoryLink(subcategory, subsub)"
              class="cursor-pointer hover:text-accent"
            >
              {{ getSubsubName(subsub) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Image Section -->
    <div class="w-[20%] h-full">
      <img
        :src="`/categoryImages/${props.categorySlug}.webp`"
        :alt="props.categorySlug"
        class="h-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useFetch, useRouter } from "#app";
import { useI18n } from "vue-i18n";
import slugify from "slugify";

const props = defineProps({
  categoryId: {
    type: [Number, null],
    required: true,
  },
  categorySlug: {
    type: String,
    required: true,
  },
});

const subcategories = ref(null);
const error = ref(null);
const { locale } = useI18n();
const router = useRouter();

// Watch for categoryId changes and fetch subcategories
watch(
  () => props.categoryId,
  async (newCategoryId) => {
    if (!newCategoryId) return;

    const { data, error: fetchError } = await useFetch(
      `/api/subCategories?categoryId=${newCategoryId}`
    );

    if (fetchError.value) {
      error.value = fetchError.value.message;
      subcategories.value = null;
    } else {
      subcategories.value = data.value?.data || [];
      error.value = null;
    }
  },
  { immediate: true }
);

const createSlug = (item, isSubsub = false) => {
  const name = isSubsub ? item.subsub_name_ro : item.subcategory_name_ro;

  return slugify(name, {
    replacement: "-",
    lower: true,
    strict: true,
  });
};

const getSubcategoryName = (subcategory) => {
  return locale.value === "ru"
    ? subcategory.subcategory_name_ru || "Unnamed"
    : subcategory.subcategory_name_ro || "Unnamed";
};

const getSubsubName = (subsub) => {
  return locale.value === "ru"
    ? subsub.subsub_name_ru || "Unnamed"
    : subsub.subsub_name_ro || "Unnamed";
};

const generateSubcategoryLink = (subcategory) => {
  if (!props.categorySlug || !subcategory) return ""; // Ensure non-empty values
  return `/categoria/${props.categorySlug}/${createSlug(subcategory)}`;
};

const generateSubsubcategoryLink = (subcategory, subsub) => {
  if (!props.categorySlug || !subcategory || !subsub) return ""; // Ensure all values exist
  return `/categoria/${props.categorySlug}/${createSlug(
    subcategory
  )}/${createSlug(subsub, true)}`;
};
</script>

<style scoped>
.columns-3 {
  column-count: 3;
  column-gap: 1rem;
}

.break-inside-avoid {
  break-inside: avoid;
  margin-bottom: 1rem;
}
</style>
