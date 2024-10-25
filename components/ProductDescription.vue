<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Skeleton } from "@/components/ui/skeleton";

const { locale } = useI18n();
const { t } = useI18n();

const props = defineProps({
  product: { type: Object, required: true, default: {} },
  productVariant: { required: true },
  hasNoProducts: { type: Boolean, default: false },
  hasVariants: { type: Boolean, default: true },
});

const { product, productVariant, hasNoProducts, hasVariants } = props;

const getProductName = () => {
  return locale.value === "ru"
    ? product?.Nume_Produs_RU
    : product?.Nume_Produs_RO;
};

const getProductDesc = () => {
  return locale.value === "ru"
    ? product?.Descriere_Produs_RU
    : product?.Descriere_Produs_RO;
};

const variantName = ref(getProductName());

// Fixed discount calculation for when standard price is higher than reduced price
const getDiscountPercentage = () => {
  if (!product?.Pret_Standard || !product?.Pret_Redus) return 0;

  const standardPrice = Math.max(product.Pret_Standard, product.Pret_Redus);
  const reducedPrice = Math.min(product.Pret_Standard, product.Pret_Redus);

  return Math.round(((standardPrice - reducedPrice) / standardPrice) * 100);
};

watch(
  () => productVariant,
  () => {
    if (productVariant?.value) {
      if (productVariant.value?.Varianta) {
        return;
      }
    }
    if (productVariant?.Varianta) {
      return;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <ul class="lg:ml-24">
    <li class="text=[#333333] font-semibold text-4xl">
      <h1>{{ variantName }}</h1>
    </li>
    <li class="border-t py-8">
      <p class="text-[#4D4D4D] font-normal text-base">{{ getProductDesc() }}</p>
    </li>
    <li v-if="product?.Pret_Redus" class="flex items-center">
      <!-- Always show the lower price first, followed by the higher price struck through -->
      <span class="font-bold"
        >{{ Math.min(product.Pret_Redus, product.Pret_Standard) }} Lei</span
      >
      <s class="ml-5 text-gray-500"
        >{{ Math.max(product.Pret_Redus, product.Pret_Standard) }} Lei</s
      >
      <div class="flex items-center ml-10">
        <span class="text-red-500 mr-2 text-xl">
          {{ getDiscountPercentage() }}%
        </span>
        <UIcon
          name="i-ph:seal-percent-fill"
          class="w-8 h-8 mr-2 text-red-500"
        />
      </div>
    </li>
    <li v-else class="font-bold">{{ product?.Pret_Standard }} Lei</li>
    <slot></slot>

    <li class="border-t w-full pt-8">
      <div class="flex justify-center items-center">
        <button
          class="dark:bg-gray-500 bg-gray-600 dark:hover:bg-charade-900 hover:bg-charade-900 py-[8px] text-white text-sm font-semibold px-4 rounded-lg hover:bg-accent-dark flex items-center justify-center content-center w-full"
          :class="props.hasNoProducts || !props.hasVariants ? 'disabled' : ''"
        >
          {{ t("buy now") }}
          <UIcon class="ml-2" name="i-ph:cursor-click" size="30" />
        </button>

        <UIcon
          class="ml-2 hover:text-accent cursor-pointer"
          name="i-ph:shopping-cart"
          size="35"
          @click="addToCart(product)"
        />
      </div>
    </li>
    <li class="flex mt-8 bg-gray-100 rounded-lg p-1 justify-center">
      <img src="assets/img/Payments.png" alt="" class="w-64" />
    </li>
  </ul>
</template>
