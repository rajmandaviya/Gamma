<script setup>
import { useI18n } from "vue-i18n";
// import { useRoute } from "vue-router";
// import slugify from "slugify";

const { locale } = useI18n();

const props = defineProps({
  subSubCategory: {
    type: Object,
    required: true,
  },
});
const { subSubCategory } = props;

// const getSubcategoryName = (subsubcategory) => {
//   return locale.value === "ru"
//     ? slugify(subsubcategory.subsub_name_ro, {
//         replacement: "-",
//         lower: true,
//         strict: true,
//       })
//     : slugify(subsubcategory.subsub_name_ro, {
//         replacement: "-",
//         lower: true,
//         strict: true,
//       });
// };

// const generateSubcategoryLink = (subcategory) => {
//   return `${path}/${getSubcategoryName(subcategory)}_${subcategory.id}`;
// };

const getName = (subSubCategory) => {
  return locale.value === "ru"
    ? subSubCategory.subsub_name_ru
    : subSubCategory.subsub_name_ro;
};
</script>

<template>
  <UCard
    class="shadow-lg flex flex-col items-center border-2 border-gray-200 hover:border-green-400 h-full"
  >
    <!-- <NuxtLink :to="generateSubcategoryLink(subcategory)"> -->
    <!-- <img :src="subcategory.images[0]" alt="" class="rounded-xl" /> -->
    <h1 class="text-center font-bold text-base">
      {{ getName(subSubCategory) }}
    </h1>
    <!-- </NuxtLink> -->
  </UCard>
</template>
