<template>
  <div class="flex mt-10 gap-4">
    <div
      class="w-[70%] p-6 border-gray-200 dark:border-gray-700 dark:bg-charade-900 rounded-lg bg-gray-100"
    >
      <h1 class="font-semibold text-3xl mb-6">{{ t("Contacteza-ne") }}</h1>
      <form @submit.prevent class="space-y-4">
        <div>
          <label
            for="name"
            class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Numele dumneavoastră") }}:</label
          >
          <input
            type="text"
            id="name"
            :placeholder="t('Numele')"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label
            for="tel"
            class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Numărul de telefon") }}:</label
          >
          <input
            type="tel"
            id="tel"
            :placeholder="t('Numărul de telefon')"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Adresa de e-mail") }}:</label
          >
          <input
            type="email"
            id="email"
            placeholder="Email"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div>
          <label
            for="message"
            class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Mesaj") }}:</label
          >
          <textarea
            id="message"
            :placeholder="t('Scrie mesajul aici...')"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-gray-500 hover:bg-charade-800 text-white px-4 py-2 rounded-lg"
        >
          {{ t("Trimite") }}
        </button>
      </form>
    </div>

    <div
      class="flex border border-gray-200 dark:border-gray-700 h-96 w-[30%] rounded-xl p-6 gap-2 items-center justify-center"
    >
      <div>
        <h1 class="font-semibold text-3xl mb-6">{{ t("Contacte") }}</h1>
        <!-- Contact Links -->
        <a href="tel:+079867092" class="flex items-center gap-2 mb-4">
          <div
            class="flex relative bg-accent p-2 rounded-full w-[40px] h-[40px] items-center justify-center"
          >
            <UIcon name="i-ph:phone-call" class="text-white" size="30" />
          </div>
          <p class="text-gray-500">079867092</p>
        </a>
        <a href="mailto:support@gamma.md" class="flex items-center gap-2 mb-4">
          <div
            class="flex bg-accent p-2 rounded-full w-[40px] h-[40px] items-center justify-center"
          >
            <UIcon name="i-ph:envelope" class="text-white" size="30" />
          </div>
          <p class="text-gray-500">info@gamma.md</p>
        </a>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Strada+Sfîntul+Gheorghe+6,+Chișinău,+Moldova"
          class="flex items-center gap-2 mb-4"
        >
          <div
            class="flex bg-accent p-2 rounded-full w-[40px] h-[40px] items-center justify-center"
          >
            <UIcon name="i-ph:map-pin" class="text-white" size="30" />
          </div>
          <p class="text-gray-500">
            Strada Sfîntul Gheorghe 6, Chișinău, Moldova
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
</script>

<style scoped></style>
