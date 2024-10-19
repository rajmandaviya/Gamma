<template>
  <h1>Subsubcategory: {{ subsubcategoryId }}</h1>

  <div v-if="status === 'pending'">Loading...</div>
  <ul
    v-else
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  >
    <li v-for="product in products" :key="product.id">
      <MainProductCard :product="product" />
    </li>
  </ul>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import slugify from 'slugify';

const { locale } = useI18n();

const products = ref([]);
const status = ref('pending'); // Initialize status
const route = useRoute();
const subsubcategoryId = route.params.subsubcategorySlug;

// Function to fetch products
const fetchProducts = async () => {
  status.value = 'pending'; // Set loading state
  const subsubcategoryIdValue = subsubcategoryId.split('_')[1];

  const { data, error } = await useFetch(
    `/api/products?sub_sub_id=${subsubcategoryIdValue}`
  );

  if (error.value) {
    console.error('Error fetching products:', error.value);
    status.value = 'error'; // Handle error state
  } else {
    products.value = data.value.products;
    status.value = 'success'; // Set success state
  }
};

const generateProductLink = (product) => {
  return `${locale.value === 'ru' ? '/ru' : ''}/produs/${slugify(
    product.Nume_Produs_RO === null ? '' : product.Nume_Produs_RO,
    {
      replacement: '-',
      lower: true,
      strict: true,
    }
  )}_${product.id}`;
};

const getProductName = (product) => {
  return locale.value === 'ru'
    ? product.Nume_Produs_RU
    : product.Nume_Produs_RO;
};

// Fetch products on component mount
await fetchProducts();

// Watch for route changes and fetch again
watch(() => route.params.subsubcategorySlug, fetchProducts);
</script>

<style scoped></style>
