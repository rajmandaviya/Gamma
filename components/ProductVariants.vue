<script setup>
import { useFilter } from '~/composables/useFilter.js';
const { variants, variantProduct } = defineProps({
  variants: { type: Object, required: true },
  variantProduct: { type: Object, required: true },
});

const {
  setColors,
  setVarsAttr1,
  setVarsAttr2,
  getAttr1name,
  getAttr2name,
  varsAttr1,
  varsAttr2,
  var_1,
  var_2,
  colors,
  color,
  changeColor,
} = useFilter(variants, variantProduct);

setColors();
setVarsAttr1();
setVarsAttr2();
</script>

<template>
    <div class="flex flex-wrap gap-8 mt-10 items-start">
        <!-- Attribute 1 Section -->
        <div class="w-full sm:w-auto">
            <h1 class="text-lg font-semibold my-2">
                {{ getAttr1name() }}:
                <span class="uppercase font-medium">{{ var_1 }}</span>
            </h1>
            <div v-for="(v, index) in varsAttr1" :key="index" class="mt-3 inline-block">
        <span
                @click="var_1 = v"
                class="uppercase mr-1 border-2 border-gray-500 p-1 rounded cursor-pointer hover:border-black transition-colors"
        >
          {{ v }}
        </span>
            </div>
        </div>

        <!-- Attribute 2 Section -->
        <div class="w-full sm:w-auto">
            <h1 class="text-lg font-semibold my-2">
                {{ getAttr2name() }}:
                <span class="uppercase font-medium">{{ var_2 }}</span>
            </h1>
            <div v-for="(v, index) in varsAttr2" :key="index" class="mt-3 inline-block">
        <span
                @click="var_2 = v"
                class="uppercase mr-1 border-2 border-gray-500 p-1 rounded cursor-pointer hover:border-black transition-colors"
        >
          {{ v }}
        </span>
            </div>
        </div>

        <!-- Color Picker Section -->
        <div class="flex gap-2 w-full sm:w-auto">
            <ul class="flex gap-2 flex-wrap">
                <li v-for="(c, index) in colors" :key="index">
                    <div
                            @click="changeColor(c)"
                            class="p-1 rounded-full border border-transparent hover:border-black cursor-pointer transition-colors"
                            :style="{ border: c === color ? '1px solid black' : '' }"
                    >
                        <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: c }"></div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Variants Section -->
        <div class="flex gap-2 w-full flex-wrap">
            <ul class="flex gap-2 flex-wrap">
                <li v-for="(v, index) in variants" :key="index">
                    <img
                            v-if="v?.Imagini?.[0]"
                            :src="v?.Imagini?.[0]"
                            alt="variant"
                            class="w-16 h-16 object-cover rounded"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>


