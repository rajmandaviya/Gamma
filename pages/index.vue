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
  } finally {
    loading.value = false;
  }
}

const fetchDiscountedProducts = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`/api/discountedProducts`);
    if (res.status === 200) {
      discountedProducts.value = res.data.products;
      key.value += 1;
    }
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

const fetchBestSellingProducts = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`/api/bestSellingProducts`);
    if (res.status === 200) {
      bestSellingProducts.value = res.data.products;
      key.value += 1;
    }
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBanner3();
  fetchDiscountedProducts();
  fetchBestSellingProducts();
});
</script>

<template>
  <div>
    <div className="w-full flex mt-5">
      <div className="hidden lg:block w-[460px]"></div>
      <div className="w-full">
        <Slider />
      </div>
    </div>
    <TopCategory class="self-center" />
    <DiscoutedProducts :products="discountedProducts" :key="key" />
    <BestSelling :products="bestSellingProducts" :key="key" class="mt-10" />
    <div className="rounded-2xl overflow-hidden mt-10">
      <img
        :src="banner3Url"
        alt="Gamma"
        v-if="banner3Url"
        class="h-[200px] object-cover w-full md:h-[300px]"
      />
    </div>
  </div>
</template>
