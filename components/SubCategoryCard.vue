<script setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import slugify from "slugify";
import { ref } from "vue";

const { path } = useRoute();

const { locale } = useI18n();
const props = defineProps({
  subcategory: {
    type: Object,
    required: true,
  },
});
const { subcategory } = props;

const imageLoaded = ref(false);

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
  return locale.value === "ru"
    ? subcategory.subcategory_name_ru
    : subcategory.subcategory_name_ro;
};

const generateSubcategoryLink = (subcategory) => {
  return `${path}/${slugify(subcategory.subcategory_name_ro, {
    replacement: "-",
    lower: true,
    strict: true,
  })}_${subcategory.id}`;
};
</script>

<template>
  <div
    class="flex bg-transparent flex-col items-center border border-gray-200 dark:border-gray-700 hover:border-accent h-full rounded-xl overflow-hidden dark:hover:border-accent"
  >
    <NuxtLink :to="generateSubcategoryLink(subcategory)">
      <USkeleton class="w-56 h-48 animate-pulse" v-if="!imageLoaded" />
      <img
        :src="subcategory.images[0]"
        :alt="getName(subcategory)"
        class="w-56 h-48"
        @load="imageLoaded = true"
        :style="{ display: imageLoaded ? 'block' : 'none' }"
      />
      <h1 class="text-center font-bold text-base my-2">
        {{ getName(subcategory) }}
      </h1>
    </NuxtLink>
  </div>
</template>
