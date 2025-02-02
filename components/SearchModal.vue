<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center h-screen"
    >
      <div
        ref="modalRef"
        class="bg-white w-[85%] min-w-[60%] dark:bg-charade-900 max-w-4xl rounded-lg shadow-lg py-10 p-6 md:p-10 relative"
      >
        <div class="flex items-center mb-6 w-full justify-between">
          <UIcon
            size="24"
            name="i-ph:magnifying-glass"
            class="text-primary dark:text-white mr-2"
          />
          <input
            ref="searchInputRef"
            type="text"
            :placeholder="t('Search products...')"
            v-model="searchTerm"
            class="flex-grow bg-transparent outline-none text-primary dark:text-white text-xl placeholder-primary/50 dark:placeholder-white/50"
            autofocus
          />
          <button
            @click="onClose"
            class="text-primary dark:text-white hover:text-accent dark:hover:text-accent transition-colors"
          >
            <UIcon size="24" name="i-ph:x-circle" />
          </button>
        </div>
        <div class="text-primary dark:text-white">
          <p>{{ t("Search results") }}: {{ searchTerm }}</p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { ref, watch, onUnmounted, nextTick } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

const searchTerm = ref("");
const modalRef = ref(null);
const searchInputRef = ref(null); // Reference for the search input

// Handle clicking outside of the modal to close
const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    props.onClose();
  }
};

// Watch for modal open state and focus input field when opened
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scroll
      await nextTick(); // Ensure DOM is updated before focusing
      searchInputRef.value?.focus(); // Focus the input
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset"; // Re-enable background scroll
    }
  }
);

onUnmounted(() => {
  // Clean up event listener when component unmounts
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
