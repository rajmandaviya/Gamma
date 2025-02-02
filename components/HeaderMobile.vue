<template>
  <div
    class="md:hidden flex justify-between items-center w-full h-[77px] border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-charade-950/80 backdrop-filter backdrop-blur-lg px-3 z-10 sticky top-0"
  >
    <!-- Logo: dark and light mode switch -->
    <NuxtLinkLocale to="/">
      <div class="h-12 w-[150px] ml-5">
        <img
          v-if="blackLogo && lightLogo"
          :src="colorMode.value === 'dark' ? lightLogo : blackLogo"
          alt="Gamma"
          class="h-full w-full"
        />
      </div>
    </NuxtLinkLocale>

    <div class="flex items-center gap-5 justify-center">
      <UIcon
        size="30"
        name="i-ph:user"
        class="mr-2"
        @click="showModal = !showModal"
      />
      <AuthModal v-if="showModal" class="absolute right-4 top-[80%] mt-7" />
      <DarkModeSwitcher />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Access current color mode
const colorMode = useColorMode();

// Reactive references for logos
const blackLogo = ref(null);
const lightLogo = ref(null);

const showModal = ref(false);
const router = useRouter();
watch(router.currentRoute, () => {
  showModal.value = false; // Reset the modal visibility when route changes
});
// Function to fetch logo data from an API
const fetchLogoData = async () => {
  try {
    const response = await fetch("/api/marketingDesign");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const logoData = await response.json();
    if (logoData.success && logoData.data.length > 0) {
      const marketingData = logoData.data[0]; // Access first record
      blackLogo.value = marketingData.Logo_Black[0]; // Set black logo
      lightLogo.value = marketingData.Logo[0]; // Set light logo

      // Store logos in localStorage for future access
      localStorage.setItem("blackLogo", blackLogo.value);
      localStorage.setItem("lightLogo", lightLogo.value);
    } else {
      console.warn("Logo data not successful or empty:", logoData);
    }
  } catch (error) {
    console.error("Error fetching logo:", error);
  }
};

onMounted(() => {
  // Load logos from localStorage if available, else fetch from API
  const storedBlackLogo = localStorage.getItem("blackLogo");
  const storedLightLogo = localStorage.getItem("lightLogo");

  if (storedBlackLogo && storedLightLogo) {
    blackLogo.value = storedBlackLogo;
    lightLogo.value = storedLightLogo;
  } else {
    fetchLogoData();
  }
});
</script>
