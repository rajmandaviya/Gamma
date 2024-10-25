<template>
  <div v-if="!selectedCategory">
    <h2 class="text-2xl font-semibold mb-4"></h2>
    <ul>
      <li
        v-for="category in categories"
        :key="category.id"
        class="flex gap-2 my-2 justify-between items-center"
      >
        <nuxt-link
          :to="`${locale === 'ru' ? '/ru' : ''}/categoria/${createSlug(
            category.Nume_Categorie_RO
          )}_${category.id}`"
          class="text-xl flex items-center gap-5"
        >
          <UIcon :name="`i-ph:${category.Icons}`" size="30" />
          {{ getCategoryName(category) }}
        </nuxt-link>

        <UIcon
          name="i-ph:caret-right"
          class="cursor-pointer"
          size="23"
          @click="fetchSubcategories(category)"
        />
      </li>
    </ul>
  </div>

  <div v-else>
    <button
      @click="goBack"
      class="mb-4 hover:underline flex items-center gap-2"
    >
      <UIcon name="i-ph:caret-left" size="23" />
      <p class="text-xl">{{ $t("inapoi") }}</p>
    </button>

    <div class="gap-4 p-2 w-full overflow-y-auto">
      <div
        v-for="subcategory in subcategories"
        :key="subcategory.id"
        class="break-inside-avoid p-3 bg-[#3A3B4A] rounded-lg mb-4"
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
              class="w-full h-48 rounded-lg animate-pulse"
              v-if="!imageLoaded[subcategory.id]"
            />
            <img
              v-if="subcategory.images && subcategory.images.length > 0"
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
            class="text-base text-gray-300 my-1"
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
</template>

<script setup>
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import slugify from "slugify";

const categories = ref([]);
const subcategories = ref([]);
const selectedCategory = ref(null);
const error = ref(null);
const imageLoaded = reactive({});

const { data, pending, error: fetchError } = await useFetch("/api/categories");

if (data.value && data.value.data) {
  categories.value = data.value.data;
}

const { locale } = useI18n();

const getCategoryName = (category) => {
  return locale.value === "ru"
    ? category.Nume_Categorie_RU
    : category.Nume_Categorie_RO;
};

const createSlug = (text) => {
  return slugify(text, {
    replacement: "-",
    lower: true,
    strict: true,
  }).toLowerCase();
};

const fetchSubcategories = async (category) => {
  selectedCategory.value = category;

  const { data, error: fetchError } = await useFetch(
    `/api/subCategories?categoryId=${category.id}`
  );

  if (fetchError.value) {
    error.value = fetchError.value.message;
    subcategories.value = [];
  } else {
    subcategories.value = data.value?.data || [];
    subcategories.value.forEach((subcategory) => {
      imageLoaded[subcategory.id] = false;
    });
  }
};

const goBack = () => {
  selectedCategory.value = null;
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
  if (!selectedCategory.value || !subcategory) return "";
  const categorySlug =
    createSlug(selectedCategory.value.Nume_Categorie_RO) +
    "_" +
    selectedCategory.value.id;
  return `${
    locale.value === "ru" ? "/ru" : ""
  }/categoria/${categorySlug}/${createSlug(subcategory.subcategory_name_ro)}_${
    subcategory.id
  }`;
};

const generateSubsubcategoryLink = (subcategory, subsub) => {
  if (!selectedCategory.value || !subcategory || !subsub) return "";
  const categorySlug =
    createSlug(selectedCategory.value.Nume_Categorie_RO) +
    "_" +
    selectedCategory.value.id;
  return `${
    locale.value === "ru" ? "/ru" : ""
  }/categoria/${categorySlug}/${createSlug(subcategory.subcategory_name_ro)}_${
    subcategory.id
  }/${createSlug(subsub.subsub_name_ro)}_${subsub.id}`;
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

.button {
  background-color: #38e991;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}
</style>
