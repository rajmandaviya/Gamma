<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
const product = ref({});

const { params } = useRoute();
const productId = params.slug.split('_')[1];

const { data } = await useFetch(`/api/product?id=${productId}`);
product.value = data.value;
</script>

<template>
  <h1>Produs Id: {{ productId }}</h1>

  <!-- BIG MAIN -->
  <main>
    <div class="flex">
      <!-- Product Primary abd Secondary Images -->
      <ProductImage :product="product.product" />

      <!-- Product Desc -->
      <ProductDescription :product="product.product" />
      <!-- Delivery -->
    </div>

    <div></div>
  </main>
  <div>
    <pre>{{ JSON.stringify(product, null, 4) }}</pre>
  </div>
</template>
