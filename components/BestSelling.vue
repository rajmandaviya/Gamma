<template>
    <div
            class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5"
    >
        <h2 class="text-2xl font-bold mb-4">{{ t("Best Selling") }}</h2>
        <div class="block md:flex gap-4">
            <div
                    class="w-full md:w-[400px] h-[300px] rounded-xl overflow-hidden"
            >
                <img
                        :src="banner2Url"
                        alt="Discounted"
                        v-if="banner2Url"
                        class="h-[300px] w-full md:w-[400px] object-cover"
                />
            </div>
            <div class="grid grid-cols-1 gap-4">
                <Carousel>
                    <CarouselContent>
                        <CarouselItem
                            v-for="(product,index) in products"
                            :key="index"
                            class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                        >
                            <ProductCardSmall :product="product" />
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious class="absolute -left-2" />
                    <CarouselNext class="absolute -right-2" />
                </Carousel>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted,defineProps } from "vue";
import { useI18n } from "vue-i18n";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const { t, locale } = useI18n();
const banner2Url = ref(null);
const props = defineProps({
    products : Array
})
const products = props.products
async function fetchBanner2() {
    try {
        const response = await fetch("/api/marketingDesign");
        const data = await response.json();
        if (data.success && data.data.length > 0) {
            // Determine which banner to use based on the locale
            if (locale.value === "ro") {
                banner2Url.value = data.data[0].Banner2_RO_[0];
            } else if (locale.value === "ru") {
                banner2Url.value = data.data[0].Banner2_RU_[0];
            }
        }
    } catch (error) {
        console.error("Error fetching Banner2 data:", error);
    }
}

onMounted(() => {
    fetchBanner2();
});
</script>