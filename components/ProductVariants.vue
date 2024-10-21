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
  <div class="flex gap-8">
    <div>
      <h1>
        {{ getAttr1name() }}
      </h1>
      <USelect :options="varsAttr1" v-model="var_1" />
    </div>
    <div>
      <h1>
        {{ getAttr2name() }}
      </h1>
      <USelect :options="varsAttr2" v-model="var_2" />
    </div>
    <ul class="flex flex-row gap-2">
      <li v-for="(c, index) in colors" :key="index">
        <div
          @click="changeColor(c)"
          class="p-1 rounded-full border border-transparent hover:border-black"
          :style="{
            border: c === color ? '1px solid black' : '',
          }"
        >
          <div
            class="size-10 rounded-full"
            :style="{ backgroundColor: c }"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>
