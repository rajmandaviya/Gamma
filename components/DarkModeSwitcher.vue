<template>
  <div class="flex flex-col items-center space-y-4 relative">
    <!-- Display Only the Active Mode Icon -->
    <div class="relative inline-flex items-center space-x-4">
      <!-- Sun icon for light mode -->
      <button
        v-if="$colorMode.preference === 'light'"
        @click="toggleDropdown"
        class="focus:outline-none justify-center items-center flex"
      >
        <UIcon name="i-ph:sun" class="bg-accent" size="30" />
      </button>

      <!-- Moon icon for dark mode -->
      <button
        v-if="$colorMode.preference === 'dark'"
        @click="toggleDropdown"
        class="focus:outline-none bg-accent p-1 rounded-full h-[38px] w-[38px]"
      >
        <UIcon name="i-ph:moon" class="bg-white" size="30" />
      </button>

      <!-- System mode: Display Sun for system light mode and Moon for system dark mode -->
      <button
        v-if="$colorMode.preference === 'system'"
        @click="toggleDropdown"
        class="focus:outline-none justify-center items-center flex"
      >
        <UIcon
          :name="isSystemDark ? 'i-ph:moon' : 'i-ph:sun'"
          class=""
          size="30"
        />
      </button>
    </div>

    <!-- Dropdown for selecting color mode -->
    <div
      v-if="showDropdown"
      class="absolute top-11 z-10 w-28 bg-white border border-gray-300 dark:border-gray-700 rounded-md shadow-md dark:bg-charade-900 dark:text-white overflow-hidden right-2"
    >
      <ul>
        <li>
          <button
            @click="selectMode('system')"
            class="block w-full px-4 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            System
          </button>
        </li>
        <li>
          <button
            @click="selectMode('light')"
            class="block w-full px-4 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Light
          </button>
        </li>
        <li>
          <button
            @click="selectMode('dark')"
            class="block w-full px-4 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Dark
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
