<template>
  <div class="dashboard py-10">
    <h1 class="text-3xl font-bold mb-6">{{ t("Dashboard") }}</h1>

    <!-- Tabs Navigation -->
    <nav>
      <ul
        class="flex gap-4 mb-6 border border-gray-200 dark:border-charade-800 p-4 rounded-lg"
      >
        <li
          v-for="tab in ['profile', 'addresses', 'orders']"
          :key="tab"
          @click="selectedTab = tab"
          :class="{ 'bg-accent': selectedTab === tab }"
          class="cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
        >
          {{ t(tab.charAt(0).toUpperCase() + tab.slice(1)) }}
        </li>
      </ul>
    </nav>

    <!-- Profile Tab -->
    <div
      v-if="selectedTab === 'profile'"
      class="p-6 dark:bg-charade-900 rounded-lg bg-gray-100"
    >
      <h2 class="text-xl font-semibold mb-4 dark:text-white text-gray-700">
        {{ t("Profile Information") }}
      </h2>
      <form v-if="userData" @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("First Name") }}:</label
          >
          <input
            v-model="profileForm.firstName"
            type="text"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Last Name") }}:</label
          >
          <input
            v-model="profileForm.lastName"
            type="text"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Phone Number") }}:</label
          >
          <input
            v-model="profileForm.phone"
            type="text"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("Email") }}:</label
          >
          <input
            v-model="profileForm.email"
            type="email"
            :disabled="
              profileForm.provider === 'google' ||
              profileForm.provider === 'facebook'
            "
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <p
            v-if="
              profileForm.provider === 'google' ||
              profileForm.provider === 'facebook'
            "
            class="text-sm text-gray-500 mt-1"
          >
            {{ t("Email cannot be changed for Google or Facebook accounts") }}
          </p>
        </div>
        <div v-if="profileForm.provider === 'email'">
          <label class="block text-sm font-medium dark:text-white text-gray-700"
            >{{ t("New Password") }}:</label
          >
          <input
            v-model="profileForm.password"
            type="password"
            class="p-2 dark:bg-[#4A4B59] bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          class="bg-gray-500 hover:bg-charade-800 text-white px-4 py-2 rounded-lg"
        >
          {{ t("Update Profile") }}
        </button>
      </form>
      <div v-if="error" class="text-red-500 mt-4">
        <p>{{ error.message || t("An error occurred") }}</p>
      </div>
    </div>

    <!-- UNotification Component with fixed position at the bottom and close button -->
    <UNotification
      v-if="notification"
      class="fixed bottom-5 left-0 right-0 md:w-[20%] w-[90%] mx-auto"
      :title="notification.title"
      :description="notification.description"
      :type="notification.type"
      :timeout="0"
      :close-button="false"
      @click="removeNotification"
      @timeout="removeNotification"
    >
    </UNotification>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const selectedTab = ref("profile");

const fetchUserProfile = () =>
  $fetch("/api/user/profile", {
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
  });

const {
  data: userData,
  error,
  refresh,
} = await useAsyncData("userProfile", fetchUserProfile);

const profileForm = reactive({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  provider: "",
  password: "",
});

watch(
  userData,
  (newUserData) => {
    if (newUserData) {
      profileForm.firstName = newUserData.Nume || "";
      profileForm.lastName = newUserData.Prenume || "";
      profileForm.phone = newUserData.Numar_Telefon || "";
      profileForm.email = newUserData.Email || "";
      profileForm.provider = newUserData.Provider || "";
    }
  },
  { immediate: true }
);

const toast = useToast();
const notification = ref(null);

const removeNotification = () => {
  notification.value = null;
};

const updateProfile = async () => {
  try {
    const updateData = {
      Nume: profileForm.firstName,
      Prenume: profileForm.lastName,
      Numar_Telefon: profileForm.phone,
      Email: profileForm.email,
      Provider: profileForm.provider,
    };

    if (profileForm.provider === "email" && profileForm.password) {
      updateData.Password = profileForm.password;
    }

    const { data, error } = await useFetch("/api/user/update-profile", {
      method: "PUT",
      body: JSON.stringify(updateData),
      headers: useRequestHeaders(["cookie"]),
      credentials: "include",
    });

    if (error.value) {
      throw new Error(error.value.message || "Failed to update profile");
    }

    notification.value = {
      title: t("Success"),
      description: t("Profilul a fost actualizat"),
      type: "success",
      duration: 2000,
    };

    await refresh();
    profileForm.password = "";

    setTimeout(() => {
      removeNotification();
    }, notification.value.duration);
  } catch (error) {
    console.error("Error updating profile:", error);

    notification.value = {
      title: t("Error"),
      description: error.message || t("An error occurred"),
      type: "error",
      duration: 3000,
    };

    setTimeout(() => {
      removeNotification();
    }, notification.value.duration);
  }
};
</script>
