<script setup>
import { useI18n } from 'vue-i18n';
import slugify from 'slugify';
const { locale } = useI18n();

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
const { product } = props;

const generateProductLink = () => {
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

const isFiftyPercentOff = computed(() => {
  const originalPrice = parseFloat(product.Pret_Standard);
  const discountPrice = parseFloat(product.Pret_Redus);
  return (originalPrice - discountPrice) / originalPrice >= 0.5;
});
const addToCart = (product) => {};
</script>

<template>
  <div
    class="product-card border hover:border-accent border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden dark:hover:border-accent hover:cursor-pointer relative"
  >
    <UIcon name="i-ph:heart-fill" size="25" class="absolute top-2 left-2" />
    <NuxtLink :to="generateProductLink()">
      <img
        loading="lazy"
        :src="
          product.Imagine_Principala !== null
            ? `http://193.160.119.179/${
                JSON.parse(product.Imagine_Principala)[0].path
              }`
            : 'NULL'
        "
        alt=""
        class="w-full h-40 object-contain drop-shadow-2xl drop-shadow-img-product"
      />
    </NuxtLink>

    <div v-if="isFiftyPercentOff" class="badge">{{ t('50% off') }}</div>
    <div class="p-4">
      <NuxtLink :to="generateProductLink()">
        <div class="flex-col justify-between items-center">
          <h2 class="text-lg font-semibold mb-3">
            {{ getProductName(product) }}
          </h2>
          <div class="flex mb-3 gap-4 justify-between">
            <span
              :class="{ 'strikethrough text-gray-500': product.Pret_Redus }"
              class="text-lg font"
            >
              {{ product.Pret_Standard }} mdl
            </span>
            <span
              v-if="product.Pret_Redus"
              class="text-lg font-semibold text-red-500"
            >
              {{ product.Pret_Redus }} mdl
            </span>
          </div>
        </div>
      </NuxtLink>

      <div class="flex justify-center items-center">
        <button
          class="dark:bg-gray-500 bg-gray-600 dark:hover:bg-charade-900 hover:bg-charade-900 py-[2px] text-white text-sm font-semibold px-4 rounded-lg hover:bg-accent-dark flex items-center justify-center content-center w-full"
        >
          Adauga in cos<UIcon name="i-ph:cursor-click" size="30" class="ml-2" />
        </button>

        <UIcon
          name="i-ph:shopping-cart"
          size="35"
          class="ml-2 hover:text-accent"
          @click="addToCart(product)"
        />
      </div>
    </div>
  </div>
</template>
