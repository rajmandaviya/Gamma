<script setup>
import {ref} from 'vue';

const props = defineProps({
    product: {type: Object, required: true},
    productVariant: {required: true},
});
const {product, productVariant} = props;

const image = ref(product?.Imagine_Principala[0]);

watch(
    () => productVariant,
    () => {
        console.log(productVariant);
        if (productVariant.value) {
            if (productVariant.value.Imagini) {
                image.value = productVariant.value.Imagini[0];
                return;
            }
        }
        if (productVariant.Imagini) {
            image.value = productVariant.value.Imagini[0];
            return;
        }
        // variantName.value = getProductName();
    },
    {deep: true, immediate: true}
);
</script>

<template>
    <div class="w-fit flex flex-col gap-4">
        <UCard class="w-fit">
            <img :src="image" alt="" class="object-contain min-w-80" loading="lazy"/>
        </UCard>
        <UCarousel
                v-slot="{ item }"
                :items="product?.imagini_Secundare"
                :ui="{ item: 'basis-1/4' }"
                class="flex gap-2"
        >
            <div class="p-2 border m-2 rounded-lg" @click="primaryImage = item">
                <img :src="item" alt="" class="m-1 aspect-square object-cover"/>
            </div>
        </UCarousel>
    </div>
</template>
