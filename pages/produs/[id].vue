<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { checkQuieries } from "~/composables/useFilter";
import axios from "axios";
// import { useFilter } from '~/composables/useFilter';

const product = ref({});
const variantProduct = ref({});

const { params, query: q } = useRoute();
const query = ref(q);
const productId = params.id.split("_")[1];
const key = ref(0);

const getProduct = async () => {
  const res = await axios.get(`/api/product?id=${productId}`);
  product.value = res.data;
  variantProduct.value = checkQuieries(product.value.variants, query.value);
  key.value += 1;
};
onMounted(() => {
  getProduct();
});
</script>

<template>
  <h1>Produs Id: {{ productId }}</h1>

  <!-- BIG MAIN -->
  <div class="flex flex-col lg:flex-row">
    <!-- Product Primary abd Secondary Images -->
    <ProductImage
      :key="key"
      :product="product.product"
      :product-variant="variantProduct"
    />

    <!-- Product Desc -->
    <ProductDescription
      :key="key"
      :product="product.product"
      :product-variant="variantProduct"
    >
      <!-- Select Variants -->
      <template v-if="product?.variants?.length > 0">
        <ProductVariants
          :key="key"
          :variants="product.variants"
          :variant-product="variantProduct"
        />
      </template>
    </ProductDescription>
  </div>
</template>
