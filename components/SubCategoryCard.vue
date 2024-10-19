<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import slugify from 'slugify';

const { path } = useRoute();

const { locale } = useI18n();
const props = defineProps({
  subcategory: {
    type: Object,
    required: true,
  },
});
const { subcategory } = props;

// const getSubcategoryName = (subcategory) => {
//   return locale.value === "ru"
//     ? slugify(subcategory.subcategory_name_ru, {
//         replacement: "-",
//         lower: true,
//         strict: true,
//       })
//     : slugify(subcategory.subcategory_name_ro, {
//         replacement: "-",
//         lower: true,
//         strict: true,
//       });
// };

const getName = (subcategory) => {
  return locale.value === 'ru'
    ? subcategory.subcategory_name_ru
    : subcategory.subcategory_name_ro;
};

const generateSubcategoryLink = (subcategory) => {
  return `${path}/${slugify(subcategory.subcategory_name_ro, {
    replacement: '-',
    lower: true,
    strict: true,
  })}_${subcategory.id}`;
};
</script>

<template>
  <UCard
    class="shadow-lg flex flex-col items-center border-2 border-gray-200 hover:border-green-400 h-full"
  >
    <NuxtLink :to="generateSubcategoryLink(subcategory)">
      <img :src="subcategory.images[0]" alt="" class="rounded-xl" />
      <h1 class="text-center font-bold text-base mt-6">
        {{ getName(subcategory) }}
      </h1>
    </NuxtLink>
  </UCard>
</template>
