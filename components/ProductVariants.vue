<script setup>
import {watch} from "vue";
import { useFilter } from '~/composables/useFilter.js';
const { variants, variantProduct } = defineProps({
  variants: { type: Object, required: true },
  variantProduct: { type: Object, required: true, default: {} },
});

const availableProducts = ref([])

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
} = useFilter(variants, variantProduct, availableProducts);

setColors();
setVarsAttr1();
setVarsAttr2();
const key = ref(0)
const isAvailable = (value) => {
    if (availableProducts.value.length > 0) {
        const foundProduct = availableProducts.value.find(p => {
            return p?.Valoare_Atribute_1?.toLowerCase().includes(value?.toLowerCase()) || p?.Valoare_Atribute_2?.toLowerCase().includes(value?.toLowerCase()) || p?.Cod_Culoare?.toLowerCase().includes(value?.toLowerCase());
        });
        return !!foundProduct; // Return true if found, false if not
    } else {
        return false;
    }
};
watch(availableProducts,(n)=>{
    key.value +=1
})
</script>
<style>
.strikethrough {
    position: relative;
    display: inline-block;
}

.strikethrough::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: gray;
    transform: rotate(-10deg);
    transform-origin: center;
}
.disabled{
    cursor: not-allowed;
    pointer-events: none; /* Disables all mouse and pointer events */
    opacity: 0.5; /* Makes it visually clear that the element is disabled */
    user-select: none;
}
</style>
<template>
    <div class="flex flex-wrap gap-8 mt-10 items-start">
        <!-- Attribute 1 Section -->
        <div class="w-full sm:w-auto" v-if="getAttr1name()">
            <h1 class="text-lg font-semibold my-2">
                {{ getAttr1name() }}:
                <span class="uppercase font-medium">{{ var_1 }}</span>
            </h1>
            <div v-for="(v, index) in varsAttr1" :key="index" class="mt-3 inline-block">
        <span
                @click="var_1 = v"
                class="uppercase mr-1 border-2 border-gray-500 py-1 px-2 rounded cursor-pointer hover:border-black transition-colors"
                :class="!isAvailable(v) && var_1 === null ? 'strikethrough disabled' : ''"
                :style="{ border: v === var_1 ? '3px solid black' : '' }"
        >
          {{ v }}
        </span>
            </div>
        </div>

        <!-- Attribute 2 Section -->
        <div class="w-full sm:w-auto" v-if="getAttr2name()">
            <h1 class="text-lg font-semibold my-2">
                {{ getAttr2name() }}:
                <span class="uppercase font-medium">{{ var_2 }}</span>
            </h1>
            <div v-for="(v, index) in varsAttr2" :key="index" class="mt-3 inline-block">
        <span
                @click="var_2 = v"
                :key="key"
                class="uppercase mr-1 border-2 border-gray-500 p-1 rounded cursor-pointer hover:border-black transition-colors"
                :class="!isAvailable(v) && var_2 === null ? 'strikethrough disabled' : ''"
                :style="{ border: v === var_2 ? '3px solid black' : '' }"
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
                            :class="!isAvailable(c) && color === null ? 'strikethrough disabled' : ''"
                            @click="changeColor(c)"
                            class="p-1 rounded-full border border-transparent hover:border-black cursor-pointer transition-colors"
                            :style="{ border: c === color ? '1px solid black' : '' }"
                    >
                        <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: c }"></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


