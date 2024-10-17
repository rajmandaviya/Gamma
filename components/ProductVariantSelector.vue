<template>
  <div class="flex flex-col gap-4">
    <div v-if="attribute1Options.length > 0" class="flex flex-col gap-2">
      <label>{{ attribute1Label }}</label>
      <select
        v-model="selectedAttribute1"
        class="p-2 border rounded"
        @change="emitSelections"
      >
        <option
          v-for="option in attribute1Options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <div v-if="attribute2Options.length > 0" class="flex flex-col gap-2">
      <label>{{ attribute2Label }}</label>
      <select
        v-model="selectedAttribute2"
        class="p-2 border rounded"
        @change="emitSelections"
      >
        <option
          v-for="option in attribute2Options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <div v-if="colorOptions.length > 0" class="flex flex-col gap-2">
      <label>{{ t("Culoare") }}: {{ selectedColorName }}</label>
      <div class="flex gap-2">
        <button
          v-for="color in colorOptions"
          :key="color.value"
          :style="{ backgroundColor: color.code }"
          :class="[
            'w-8 h-8 rounded-full border-2',
            selectedColor === color.value
              ? 'border-blue-500'
              : 'border-transparent',
            color.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          ]"
          :disabled="color.disabled"
          @click="selectColor(color)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const props = defineProps({
  attribute1: {
    type: Object,
    required: true,
  },
  attribute2: {
    type: Object,
    required: true,
  },
  colorOptions: {
    type: Array,
    required: true,
  },
  attribute1Options: {
    type: Array,
    required: true,
  },
  attribute2Options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:selections"]);

const selectedAttribute1 = ref(props.attribute1Options[0] || "");
const selectedAttribute2 = ref(props.attribute2Options[0] || "");
const selectedColor = ref(props.colorOptions[0]?.value || "");

const attribute1Label = computed(() => {
  return locale.value === "ro"
    ? props.attribute1.Atribut_RO_
    : props.attribute1.Atribut_RU_;
});

const attribute2Label = computed(() => {
  return locale.value === "ro"
    ? props.attribute2.Atribut_RO_
    : props.attribute2.Atribut_RU_;
});

const selectedColorName = computed(() => {
  const selected = props.colorOptions.find(
    (color) => color.value === selectedColor.value
  );
  return selected ? selected.value : "";
});

const selectColor = (color) => {
  if (!color.disabled) {
    selectedColor.value = color.value;
    emitSelections();
  }
};

const emitSelections = () => {
  emit("update:selections", {
    attribute1: selectedAttribute1.value,
    attribute2: selectedAttribute2.value,
    color: selectedColor.value,
  });
};

watch(
  [
    () => props.attribute1Options,
    () => props.attribute2Options,
    () => props.colorOptions,
  ],
  ([newAttr1Options, newAttr2Options, newColorOptions]) => {
    if (
      newAttr1Options.length > 0 &&
      !newAttr1Options.includes(selectedAttribute1.value)
    ) {
      selectedAttribute1.value = newAttr1Options[0];
    }
    if (
      newAttr2Options.length > 0 &&
      !newAttr2Options.includes(selectedAttribute2.value)
    ) {
      selectedAttribute2.value = newAttr2Options[0];
    }
    if (
      newColorOptions.length > 0 &&
      !newColorOptions.some((color) => color.value === selectedColor.value)
    ) {
      selectedColor.value = newColorOptions[0].value;
    }
    emitSelections();
  }
);

// Initial emit
emitSelections();
</script>
