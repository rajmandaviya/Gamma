<script setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import axios from "axios";

const { t, locale } = useI18n();
const banner3Url = ref(null);
const loading = ref(true);
const discountedProducts = ref([]);
const bestSellingProducts = ref([]);
const key = ref(0);

async function fetchBanner3() {
  try {
    const response = await fetch("/api/marketingDesign");
    const data = await response.json();
    if (data.success && data.data.length > 0) {
      if (locale.value === "ro") {
        banner3Url.value = data.data[0].Banner3_RO_[0];
      } else if (locale.value === "ru") {
        banner3Url.value = data.data[0].Banner3_RU_[0];
      }
    }
  } catch (error) {
    console.error("Error fetching Banner3 data:", error);
  }
}

const fetchDiscountedProducts = async () => {
  try {
    const res = await axios.get(`/api/discountedProducts`);
    if (res.status === 200) {
      discountedProducts.value = res.data.products;
      key.value += 1;
    }
  } catch (error) {
    console.error("Error fetching discounted products:", error);
  }
};

const fetchBestSellingProducts = async () => {
  try {
    const res = await axios.get(`/api/bestSellingProducts`);
    if (res.status === 200) {
      bestSellingProducts.value = res.data.products;
      key.value += 1;
    }
  } catch (error) {
    console.error("Error fetching best selling products:", error);
  }
};

const fetchAllData = async () => {
  loading.value = true;
  await Promise.all([
    fetchBanner3(),
    fetchDiscountedProducts(),
    fetchBestSellingProducts(),
  ]);
  loading.value = false;
};

onMounted(() => {
  fetchAllData();
});
</script>

<template>
  <div>
    <div class="w-full flex mt-5">
      <div class="hidden lg:block w-[460px]"></div>
      <div class="w-full">
        <Slider />
      </div>
    </div>
    <TopCategory class="self-center" />
    <DiscoutedProducts
      :products="discountedProducts"
      :loading="loading"
      :key="key"
    />
    <BestSelling
      :products="bestSellingProducts"
      :loading="loading"
      :key="key"
      class="mt-10"
    />
    <div class="rounded-2xl overflow-hidden mt-10">
      <Skeleton
        v-if="loading || !banner3Url"
        class="h-[200px] w-full md:h-[300px]"
      />
      <img
        v-else
        :src="banner3Url"
        alt="Gamma"
        class="h-[200px] object-cover w-full md:h-[300px]"
      />
    </div>
    <h1 class="text-base mt-2 text-center text-gray-600 dark:text-white">
      {{ t("Pentru comenzile de peste 1000 de lei, livrarea este gratuită.") }}
    </h1>
  </div>
</template>
