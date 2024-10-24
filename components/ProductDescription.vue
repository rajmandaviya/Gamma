<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const { t } = useI18n();

const props = defineProps({
  product: { type: Object, required: true },
  productVariant: { required: true },
});
const { product, productVariant } = props;

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

watch(
  () => productVariant,
  () => {
    if (productVariant.value) {
      if (productVariant.value.Varianta) {
        variantName.value = productVariant.value.Varianta;
        return;
      }
    }
    if (productVariant.Varianta) {
      variantName.value = productVariant.Varianta;
      return;
    }
    variantName.value = getProductName();
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
    <li
      v-if="product?.Pret_Redus && product?.Pret_Standard > product?.Pret_Redus"
      class="flex items-center"
    >
      <div class="flex items-center mr-10">
        <UIcon
          name="i-ph:seal-percent-fill"
          class="w-8 h-8 mr-2 text-red-500"
        />
        <span class="text-red-500 mr-2">
          -
          {{
            (
              ((product?.Pret_Standard - product?.Pret_Redus) /
                product?.Pret_Standard) *
              100
            ).toFixed(2)
          }}
        </span>
      </div>
      <span class="font-bold"> {{ product?.Pret_Redus }} Lei </span>
      <s class="ml-5 text-gray-500">{{ product?.Pret_Standard }} Lei</s>
    </li>
    <li v-else class="font-bold">{{ product?.Pret_Standard }} Lei</li>
    <slot></slot>
    <li class="border-t w-full pt-8">
      <div class="flex justify-center items-center">
        <button
          class="dark:bg-gray-500 bg-gray-600 dark:hover:bg-charade-900 hover:bg-charade-900 py-[8px] text-white text-sm font-semibold px-4 rounded-lg hover:bg-accent-dark flex items-center justify-center content-center w-full"
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
    </li>
    <li class="mt-8">
      <img src="assets/img/Payments.png" alt="" class="w-64" />
    </li>
  </ul>
</template>
