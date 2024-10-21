<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { checkQuieries } from '~/composables/useFilter';
// import { useFilter } from '~/composables/useFilter';

const product = ref({});
const variantProduct = ref({});

const { params, query: q } = useRoute();
const query = ref(q);
const productId = params.slug.split('_')[1];

const { data } = await useFetch(`/api/product?id=${productId}`);

product.value = data.value;
variantProduct.value = checkQuieries(product.value.variants, query.value);
</script>

<template>
  <h1>Produs Id: {{ productId }}</h1>

  <!-- BIG MAIN -->

  <div class="flex">
    <!-- Product Primary abd Secondary Images -->
    <ProductImage
      :product="product.product"
      :product-variant="variantProduct"
    />

    <!-- Product Desc -->
    <ProductDescription
      :product="product.product"
      :product-variant="variantProduct"
    />

    <!-- Delivery -->
  </div>
  <!-- Select Variants -->
  <ProductVariants
    :variants="product.variants"
    :variant-product="variantProduct"
  />
</template>
