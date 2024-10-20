<template>
  <div class="flex">
    <div class="flex-1 p-2 overflow-hidden">
      <div
        v-if="subcategories"
        class="grid grid-cols-3 auto-rows-auto gap-4 h-full overflow-y-auto"
      >
        <div
          v-for="subcategory in subcategories"
          :key="subcategory.id"
          class="p-3 bg-gray-100 dark:bg-[#3A3B4A] rounded-md mb-4"
        >
          <h3 class="text-xl font-semibold">
            <NuxtLink
              :to="generateSubcategoryLink(subcategory)"
              class="cursor-pointer hover:text-accent"
            >
              {{ getSubcategoryName(subcategory) }}
            </NuxtLink>
          </h3>

          <div class="my-2">
            <NuxtLink
              :to="generateSubcategoryLink(subcategory)"
              class="block w-full"
            >
              <USkeleton
                class="w-full h-48 rounded-md animate-pulse"
                v-if="!imageLoaded[subcategory.id]"
              />
              <img
                :src="subcategory.images[0]"
                :alt="getSubcategoryName(subcategory)"
                class="w-full h-48 object-cover rounded-md hover:opacity-80 transition-opacity"
                @load="imageLoaded[subcategory.id] = true"
                :style="{
                  display: imageLoaded[subcategory.id] ? 'block' : 'none',
                }"
              />
            </NuxtLink>
          </div>

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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from "vue";
import { useFetch, useRouter } from "#app";
import { useI18n } from "vue-i18n";
import slugify from "slugify";

const imageLoaded = reactive({});

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
    subcategories.value.forEach((subcategory) => {
      imageLoaded[subcategory.id] = false;
    });
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
  if (!props.categorySlug || !subcategory) return "";
  return `${locale.value === "ru" ? "/ru" : ""}/categoria/${
    props.categorySlug
  }/${createSlug(subcategory)}_${subcategory.id}`;
};

const generateSubsubcategoryLink = (subcategory, subsub) => {
  if (!props.categorySlug || !subcategory || !subsub) return "";
  return `/categoria/${props.categorySlug}/${createSlug(subcategory)}_${
    subcategory.id
  }/${createSlug(subsub, true)}_${subsub.id}`;
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); /* 3 equal columns */
  gap: 1rem;
}

.grid-item {
  break-inside: avoid; /* Prevent content from breaking across columns */
  align-self: start; /* Align items at the start of each column */
  margin-bottom: 1rem;
}

/* Ensure each row height adapts to the content */
.auto-rows-auto {
  grid-auto-rows: auto;
}
</style>
