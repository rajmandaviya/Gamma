<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';

const {locale} = useI18n();

const props = defineProps({
    product: {type: Object, required: true},
    productVariant: {required: true},
});
const {product, productVariant} = props;

const getProductName = () => {
    return locale.value === 'ru'
        ? product?.Nume_Produs_RU
        : product?.Nume_Produs_RO;
};
const getProductDesc = () => {
    return locale.value === 'ru'
        ? product?.Descriere_Produs_RU
        : product?.Descriere_Produs_RO;
};

const variantName = ref(getProductName());

watch(
    () => productVariant,
    () => {
        if (productVariant.value) {
            if (productVariant.value.Varianta) {
                variantName.value = productVariant.value.Varianta;
                return;
            }
        }
        if (productVariant.Varianta) {
            variantName.value = productVariant.Varianta;
            return;
        }
        variantName.value = getProductName();
    },
    {deep: true, immediate: true}
);
</script>

<template>
    <ul class="lg:ml-24">
        <li class="text=[#333333] font-semibold text-4xl">
            <h1>{{ variantName }}</h1>
        </li>
        <li class="border-t py-8">
            <p class="text-[#4D4D4D] font-normal text-base">{{ getProductDesc() }}</p>
        </li>
        <li v-if="product?.Pret_Redus && product?.Pret_Standard > product?.Pret_Redus" class="flex items-center">
            <img src="assets/img/percent.png" class="w-8 h-8 mr-2" alt="discount" />
            <span class="text-red-500 mr-2">
                - {{(((product?.Pret_Standard - product?.Pret_Redus) / product?.Pret_Standard) * 100).toFixed(2)}} %
            </span>
            <span class="font-bold">
                {{product?.Pret_Redus}} Lei
            </span>
            <s class="ml-5 text-gray-500">{{product?.Pret_Standard}} Lei</s>
        </li>
        <li v-else class="font-bold">
            {{product?.Pret_Standard}} Lei
        </li>
        <slot></slot>
        <li class="border-t w-full pt-8">
            <button
                    class="w-full flex justify-center items-center bg-[#121535] py-3 text-white text-base font-medium shadow-xl rounded-lg"
            >
                <span>
                    Cumpara cu un click
                </span>
                <img src="assets/img/img.png" class="h-4 w-4" alt="">
            </button>
        </li>
        <li class="mt-8">
            <img src="assets/img/Payments.png" alt="" class="w-52">

        </li>
    </ul>
</template>
