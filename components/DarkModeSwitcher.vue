<template>
  <div class="flex flex-col items-center space-y-4 relative">
    <!-- Display Only the Active Mode Icon -->
    <div class="relative inline-flex items-center space-x-4">
      <!-- Sun icon for light mode -->
      <button
        v-if="$colorMode.preference === 'light'"
        @click="toggleDropdown"
        class="focus:outline-none"
      >
        <UIcon name="i-ph:sun" class="bg-accent" size="30" />
      </button>

      <!-- Moon icon for dark mode -->
      <button
        v-if="$colorMode.preference === 'dark'"
        @click="toggleDropdown"
        class="focus:outline-none bg-accent p-1 rounded-full justify-center items-center h-[40px] w-[40px]"
      >
        <UIcon name="i-ph:moon" class="bg-white" size="30" />
      </button>

      <!-- System mode: Display Sun for system light mode and Moon for system dark mode -->
      <button
        v-if="$colorMode.preference === 'system'"
        @click="toggleDropdown"
        class="focus:outline-none"
      >
        <UIcon
          :name="isSystemDark ? 'i-ph:moon' : 'i-ph:sun'"
          class=""
          size="30"
        />
      </button>

      <!-- Sepia icon for sepia mode -->
      <button
        v-if="$colorMode.preference === 'sepia'"
        @click="toggleDropdown"
        class="focus:outline-none"
      >
        <UIcon name="i-ph:exclude-square-light" class="bg-accent" size="30" />
      </button>
    </div>

    <!-- Dropdown for selecting color mode -->
    <div
      v-if="showDropdown"
      class="absolute top-12 z-10 w-32 bg-white border border-gray-300 rounded-md shadow-md dark:bg-charade-900 dark:text-white overflow-hidden right-1"
    >
      <ul>
        <li>
          <button
            @click="selectMode('system')"
            class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            System
          </button>
        </li>
        <li>
          <button
            @click="selectMode('light')"
            class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Light
          </button>
        </li>
        <li>
          <button
            @click="selectMode('dark')"
            class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Dark
          </button>
        </li>
        <li>
          <button
            @click="selectMode('sepia')"
            class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Sepia
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Import and initialize color mode
const colorMode = useColorMode();

// State to track the visibility of the dropdown switcher
const showDropdown = ref(false);

// State to track whether the system is in dark mode
const isSystemDark = ref(false);

// Function to toggle the dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Function to select the mode and close the dropdown
const selectMode = (mode) => {
  colorMode.preference = mode;
  showDropdown.value = false;
};

// Function to check system's color scheme preference
const checkSystemDarkMode = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    isSystemDark.value = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  }
};

// Use onMounted to ensure it runs in a browser environment
onMounted(() => {
  checkSystemDarkMode();

  // Add a listener for system dark mode changes
  if (typeof window !== "undefined" && window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        isSystemDark.value = event.matches;
      });
  }
});
</script>

<style scoped>
/* Styling for sepia mode */
body.sepia-mode {
  background-color: #f1e7d0;
  color: #433422;
}
</style>
