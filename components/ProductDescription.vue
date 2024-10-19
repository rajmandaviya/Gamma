<script setup>
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();

const props = defineProps({
  product: { type: Object, required: true },
});
const { product } = props;

const getProductName = () => {
  return locale.value === 'ru'
    ? product.Nume_Produs_RU
    : product.Nume_Produs_RO;
};
const getProductDesc = () => {
  return locale.value === 'ru'
    ? product.Descriere_Produs_RU
    : product.Descriere_Produs_RO;
};
</script>

<template>
  <ul class="ml-24">
    <li class="text=[#333333] font-semibold text-4xl pb-14">
      <h1>{{ getProductName() }}</h1>
    </li>
    <li class="border-t py-16">
      <p class="text-[#4D4D4D] font-normal text-base">{{ getProductDesc() }}</p>
    </li>
    <li class="border-t"></li>
    <li class="border-t w-full pt-8">
      <button
        class="w-full bg-[#121535] py-5 text-white text-base font-medium shadow-xl rounded-lg"
      >
        Cumpara cu un click
      </button>
    </li>
  </ul>
</template>
