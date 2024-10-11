<template>
  <div>
    <!-- Breadcrumb -->
    <nav class="breadcrumb mt-4">
      <ul class="flex items-center space-x-2">
        <li>
          <NuxtLink
            to="/"
            class="flex items-center text-accent hover:underline"
          >
            <UIcon name="i-ph:house" size="20" class="mr-1" />
            {{ t("Acasă") }}
          </NuxtLink>
        </li>
        <li>/</li>
        <li class="text-gray-500">
          {{ t("Detalii produs") }}
        </li>
      </ul>
    </nav>

    <!-- Responsive flex container -->
    <div class="w-full flex flex-col lg:flex-row my-7 gap-6">
      <div class="w-full lg:w-[45%] h-full">
        <!-- carousel  -->
        <ProductImageCarousel
          :images="images"
          class="w-full h-auto lg:h-full"
        />
      </div>
      <!-- Block with product details -->
      <div class="flex flex-col w-full gap-6 lg:w-3/5">
        <H1 class="text-2xl lg:text-3xl font-bold">Nume Produs</H1>

        <div class="h-[1px] bg-gray-200 dark:bg-gray-600 mb-10"></div>
        <p class="text-gray-500 text-sm lg:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et doloribus
          sequi, dignissimos libero temporibus quas quasi consequatur deserunt.
          Ipsum error eos voluptatum impedit beatae facere odit. Saepe tenetur
          sed nobis!
        </p>

        <!-- price block -->
        <div class="flex items-center gap-4 mb-10 mt-2">
          <div class="flex items-center gap-2 mr-6">
            <UIcon name="i-ph:seal-percent" size="35" class="bg-[#ef4444]" />
            <h3
              class="text-charade-900 dark:text-white text-2xl lg:text-3xl font-bold"
            >
              3000 {{ t("MDL") }}
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-gray-500 text-sm lg:text-base">
              {{ t("Pret obisnuit") }}
            </p>
            <p class="text-gray-500 line-through text-lg lg:text-xl">
              3500 {{ t("MDL") }}
            </p>
          </div>
        </div>
        <!-- price block end -->
        <div class="h-[1px] bg-gray-200 dark:bg-gray-600 mb-10"></div>
        <div class="flex items-center justify-between">
          <div>color</div>
          <div>variants</div>
        </div>
        <div class="h-[1px] bg-gray-200 dark:bg-gray-600 mb-10"></div>
      </div>
      <!-- add to cart block -->
      <div
        class="w-full lg:w-[35%] flex border border-gray-200 dark:border-gray-600 h-[300px] lg:h-[400px] rounded-xl"
      ></div>
    </div>
    <!-- Description  block  -->
    <div
      class="w-full border border-gray-200 dark:border-gray-600 p-10 rounded-xl text-center md:text-left"
    >
      <div class="flex items-center justify-center md:justify-between py-5">
        <!-- Tabs -->
        <div class="tabs flex mb-4 gap-4">
          <button
            class="tab-button px-4 py-2 rounded-lg"
            :class="
              activeTab === 'description1'
                ? 'bg-charade-900 dark:bg-white text-white dark:text-charade-900'
                : ''
            "
            @click="activeTab = 'description1'"
          >
            {{ t("Descriere") }}
          </button>
          <button
            class="tab-button px-4 py-2 rounded-lg"
            :class="
              activeTab === 'description2'
                ? 'bg-charade-900 dark:bg-white text-white dark:text-charade-900'
                : ''
            "
            @click="activeTab = 'description2'"
          >
            {{ t("Caracteristici") }}
          </button>
        </div>
        <div
          class="hidden md:flex items-center bg-gray-200 dark:bg-gray-600 p-2 rounded-full gap-2 text-sm font-normal"
        >
          <UIcon name="i-ph:seal-check" size="30" class="text-green-500" />
          <p class="text-gray-500 dark:text-gray-200">
            {{ t("100% satisfactie garantata") }}
          </p>
        </div>
      </div>
      <!-- Tab Content -->
      <div v-if="activeTab === 'description1'" class="w-full">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut eum,
          consequuntur sed aspernatur nobis debitis illum quos ipsa. Adipisci
          quam dolores cupiditate ipsum mollitia atque debitis veritatis
          nostrum, consequuntur modi.
        </p>
      </div>

      <div v-else-if="activeTab === 'description2'" class="w-full">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          vehicula urna a risus scelerisque, id interdum justo sagittis. In
          faucibus, leo in laoreet lacinia, eros risus posuere tortor, id
          sollicitudin ex odio ut elit.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
import { useI18n } from "vue-i18n";
const activeTab = ref("description1");
const images = [
  "https://picsum.photos/600/800?random=1",
  "https://picsum.photos/600/800?random=2",
  "https://picsum.photos/600/800?random=3",
  "https://picsum.photos/600/800?random=4",
  "https://picsum.photos/600/800?random=5",
  "https://picsum.photos/600/800?random=6",
];
</script>

<style scoped>
/* Your styles here */
</style>
