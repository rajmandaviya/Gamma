<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { checkQuieries } from "~/composables/useFilter";
import axios from "axios";

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
  <div class="my-10">
    <!-- BIG MAIN -->
    <div class="flex flex-col lg:flex-row gap-10">
      <ProductImage
        :key="key"
        :product="product.product"
        :product-variant="variantProduct"
        class="lg:w-[50%]"
      />

      <!-- Product Desc -->
      <ProductDescription
        :key="key"
        :product="product.product"
        :product-variant="variantProduct"
        class="lg:w-[50%]"
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
  </div>
</template>
