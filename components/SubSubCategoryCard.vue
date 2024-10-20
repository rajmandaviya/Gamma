<script setup>
import { useI18n } from "vue-i18n";
import slugify from "slugify";
import { useRoute } from "vue-router";
const { path } = useRoute();

const { locale } = useI18n();

const props = defineProps({
  subSubCategory: {
    type: Object,
    required: true,
  },
});
const { subSubCategory } = props;

const getSubcategoryName = (subsubcategory) => {
  return locale.value === "ru"
    ? slugify(subsubcategory.subsub_name_ro, {
        replacement: "-",
        lower: true,
        strict: true,
      })
    : slugify(subsubcategory.subsub_name_ro, {
        replacement: "-",
        lower: true,
        strict: true,
      });
};

const generateSubSubcategoryLink = () => {
  return `${path}/${getSubcategoryName(subSubCategory)}_${subSubCategory.id}`;
};

const getName = (subSubCategory) => {
  return locale.value === "ru"
    ? subSubCategory.subsub_name_ru
    : subSubCategory.subsub_name_ro;
};
</script>

<template>
  <NuxtLink :to="generateSubSubcategoryLink()">
    <div
      class="flex bg-transparent flex-col items-center border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent h-full rounded-xl overflow-hidden p-4"
    >
      <h1 class="text-center font-bold text-base">
        {{ getName(subSubCategory) }}
      </h1>
    </div>
  </NuxtLink>
</template>
