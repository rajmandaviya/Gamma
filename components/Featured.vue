<template>
  <div
    class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5"
  >
    <h2 class="text-2xl font-bold mb-4">{{ t("Discounted") }}</h2>
    <div
      class="flex justify-between items-center rounded-2xl overflow-hidden mb-4"
    ></div>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <ProductCardSmall />
      <ProductCardSmall />
      <ProductCardSmall />
      <ProductCardSmall />
      <ProductCardSmall />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
