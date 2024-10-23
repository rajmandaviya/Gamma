<template>
  <div>
    <h1 class="text-2xl font-bold mt-6 mb-6">
      {{ formatCategoryName(subsubcategoryId.split("_")[0]) }}
    </h1>

    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center min-h-[200px]"
    >
      <div class="text-lg text-gray-600">Loading...</div>
    </div>

    <div v-else-if="status === 'error'" class="text-red-600">
      Failed to load products. Please try again.
    </div>

    <ul
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <li v-for="product in products" :key="product.id">
        <MainProductCard :product="product" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import slugify from "slugify";

const { locale } = useI18n();

const products = ref([]);
const status = ref("pending");
const route = useRoute();
const subsubcategoryId = route.params.subsubcategorySlug;

// Function to format category name from slug
const formatCategoryName = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Function to fetch products
const fetchProducts = async () => {
  status.value = "pending";
  const subsubcategoryIdValue = subsubcategoryId.split("_")[1];

  const { data, error } = await useFetch(
    `/api/products?sub_sub_id=${subsubcategoryIdValue}`
  );

  if (error.value) {
    console.error("Error fetching products:", error.value);
    status.value = "error";
  } else {
    products.value = data.value.products;
    status.value = "success";
  }
};

const generateProductLink = (product) => {
  return `${locale.value === "ru" ? "/ru" : ""}/produs/${slugify(
    product.Nume_Produs_RO === null ? "" : product.Nume_Produs_RO,
    {
      replacement: "-",
      lower: true,
      strict: true,
    }
  )}_${product.id}`;
};

const getProductName = (product) => {
  return locale.value === "ru"
    ? product.Nume_Produs_RU
    : product.Nume_Produs_RO;
};

await fetchProducts();

watch(() => route.params.subsubcategorySlug, fetchProducts);
</script>
