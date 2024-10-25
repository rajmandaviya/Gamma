<template>
  <div
    class="product-card border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden py-2 p-4 space-y-4"
    :class="{ 'hover:border-accent hover:cursor-pointer': !loading }"
    @click="!loading && $router.push(`/produs/${product.slug}_${product.id}`)"
  >
    <div class="relative h-40 flex items-center justify-center">
      <div v-if="!loading && isFiftyPercentOff" class="badge z-20">
        {{ t("50% off") }}
      </div>
      <Skeleton v-if="loading" class="h-40 w-full" />
      <img
        v-else
        :alt="product.name"
        :class="product.image ? 'product-image' : 'default-image'"
        :src="
          product.image
            ? product.image
            : `${baseUrl}/download/noco/pm6ki25nwijgjda/m1urcj8gi35hvr3/cvdhh4nrs88ygdx/logo_Kduho.svg`
        "
      />
    </div>

    <div class="space-y-3">
      <Skeleton v-if="loading" class="h-6 w-3/4" />
      <h2 v-else class="text-lg font-semibold">{{ product.name }}</h2>
      <div class="flex justify-between">
        <template v-if="loading">
          <Skeleton class="h-6 w-20" />
          <Skeleton class="h-6 w-20" />
        </template>
        <template v-else>
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
        </template>
      </div>
      <div class="flex items-center gap-2">
        <template v-if="loading">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-10 w-10" />
        </template>
        <template v-else>
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
            @click.stop="addToCart(product)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRuntimeConfig } from "#imports";
import { Skeleton } from "@/components/ui/skeleton";

const { t, locale } = useI18n();
const props = defineProps({
  product: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
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
if (props.product && !props.loading) {
  setProduct(productObject.value);
}

const isFiftyPercentOff = computed(() => {
  if (props.loading) return false;
  const originalPrice = parseFloat(product.value.price);
  const discountPrice = parseFloat(product.value.discount);
  return (originalPrice - discountPrice) / originalPrice >= 0.5;
});
</script>

<style>
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
</style>

<style scoped>
.product-card {
  max-width: 100%;
  position: relative;
}

.product-image {
  max-width: 100%;
  max-height: 160px; /* Matches the container height */
  width: auto;
  height: auto;
  object-fit: contain;
}

.default-image {
  width: 80px;
  height: auto;
}

.drop-shadow-img-product {
  filter: drop-shadow(0px 0px 3px #84848c);
}

.badge {
  position: absolute;
  top: -10px;
  right: -20px;
  background-color: #ef4444;
  color: white;
  padding: 5px 10px;
  border-radius: 0 0 0 10px;
  font-size: 0.75rem;
  font-weight: bold;
}
</style>
