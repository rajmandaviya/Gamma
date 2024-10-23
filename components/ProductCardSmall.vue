<template>
  <div
    class="product-card border hover:border-accent border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden dark:hover:border-accent hover:cursor-pointer relative py-2"
    @click="$router.push(`/produs/${product.slug}_${product.id}`)"
  >
    <UIcon class="absolute top-2 left-2" name="i-ph:heart-fill" size="25" />
    <img
      :alt="product.name"
      :class="product.image ? '' : '!w-20 m-auto'"
      :src="
        product.image
          ? product.image
          : `${baseUrl}/download/noco/pm6ki25nwijgjda/m1urcj8gi35hvr3/cvdhh4nrs88ygdx/logo_Kduho.svg`
      "
      class="w-full h-40 object-contain drop-shadow-2xl drop-shadow-img-product"
    />
    <div v-if="isFiftyPercentOff" class="badge">{{ t("50% off") }}</div>
    <div class="p-4">
      <div class="flex-col justify-between items-center">
        <h2 class="text-lg font-semibold mb-3">{{ product.name }}</h2>
        <div class="flex mb-3 gap-4 justify-between">
          <span
            :class="{ 'strikethrough text-gray-500': product.discount }"
            class="text-lg font"
          >
            {{ product.price }} lei
          </span>
          <span
            v-if="product.discount"
            class="text-lg font-semibold text-red-500"
          >
            {{ product.discount }} lei
          </span>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <button
          class="dark:bg-gray-500 bg-gray-600 dark:hover:bg-charade-900 hover:bg-charade-900 py-[2px] text-white text-sm font-semibold px-4 rounded-lg hover:bg-accent-dark flex items-center justify-center content-center w-full"
        >
          {{ t("buy now") }}
          <UIcon class="ml-2" name="i-ph:cursor-click" size="30" />
        </button>

        <UIcon
          class="ml-2 hover:text-accent"
          name="i-ph:shopping-cart"
          size="35"
          @click="addToCart(product)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import { useRuntimeConfig } from "#imports";

const { t, locale } = useI18n();
const props = defineProps({
  product: Object,
});
const config = useRuntimeConfig();
const baseUrl = config.public.baseURL;
let lang = locale.value;
const product = ref({});
const addToCart = (product) => {};
const setProduct = (p) => {
  product.value = {
    slug: p?.Nume_Produs_RO?.split(" ").join("-"),
    id: p.id,
    name: lang === "ro" ? p.Nume_Produs_RO : p.Nume_Produs_RU,
    image: getImage(p.Imagine_Principala),
    discount: p.Pret_Redus,
    price: p.Pret_Standard,
  };
};
const getImage = (obj) => {
  const images = obj ? JSON.parse(obj) : [];
  return images.length > 0 ? `${baseUrl}/${images[0]?.path}` : null;
};
const productObject = ref(props.product ?? null);
if (props.product) {
  setProduct(productObject.value);
}

const isFiftyPercentOff = computed(() => {
  const originalPrice = parseFloat(product.value.price);
  const discountPrice = parseFloat(product.value.discount);
  return (originalPrice - discountPrice) / originalPrice >= 0.5;
});
</script>

<style scoped>
.product-card {
  max-width: 100%;
  position: relative;
}

.drop-shadow-img-product {
  filter: drop-shadow(0px 0px 3px #84848c);
}

.strikethrough {
  position: relative;
  display: inline-block;
}

.strikethrough::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: gray;
  transform: rotate(-10deg);
  transform-origin: center;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  padding: 5px 10px;
  border-radius: 0 0 0 10px;
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
