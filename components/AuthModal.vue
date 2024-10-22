<script setup>
const {
  loggedIn,
  user,
  session,
  fetch: sessionFetch,
  clear,
} = useUserSession();

import { useI18n } from "vue-i18n";
import { ref, computed, watchEffect } from "vue";

const { t } = useI18n();

const activeTab = ref("login");
const profileImage = ref("");
const imageLoaded = ref(false);
const imageError = ref(false);

const email = ref("");
const fullName = ref("");
const password = ref("");

const loginEmail = ref("");
const loginPassword = ref("");

const errorMessage = ref("");
const successMessage = ref("");

const { data: userData, error: userDataError } = useFetch(
  () => (loggedIn.value ? "/api/user/profile" : null),
  {
    server: false,
    lazy: true,
  }
);

watchEffect(() => {
  if (userData.value && userData.value.Profile_Image) {
    profileImage.value = userData.value.Profile_Image;
    const img = new Image();
    img.onload = () => {
      imageLoaded.value = true;
      imageError.value = false;
    };
    img.onerror = () => {
      imageLoaded.value = false;
      imageError.value = true;
    };
    img.src = userData.value.Profile_Image;
  } else {
    imageError.value = true;
  }
});

const userInitials = computed(() => {
  if (userData.value?.Nume && userData.value?.Prenume) {
    return (userData.value.Nume[0] + userData.value.Prenume[0]).toUpperCase();
  }
  return user.value?.firstName?.[0]?.toUpperCase() || "";
});

const switchTab = (tab) => {
  activeTab.value = tab;
  errorMessage.value = "";
  successMessage.value = "";
};

const handleRegister = async (e) => {
  e.preventDefault();

  errorMessage.value = "";
  successMessage.value = "";

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        fullName: fullName.value,
      }),
    });

    if (res.ok) {
      const data = await res.json();

      successMessage.value = t(
        data.message || "auth.user_registered_successfully"
      );
      setTimeout(() => {
        successMessage.value = "";
        activeTab.value = "login";
      }, 3000);
    } else {
      const errorData = await res.json();

      errorMessage.value = t(
        errorData.data?.errorCode || "auth.internal_error"
      );
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
    }
  } catch (err) {
    errorMessage.value = t("auth.internal_error");

    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const handleLogin = async (e) => {
  e.preventDefault();

  errorMessage.value = "";

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value,
      }),
    });

    if (res.ok) {
      await sessionFetch();
      loggedIn.value = true;
    } else {
      const errorData = await res.json();

      errorMessage.value = t(
        errorData.data?.errorCode || "auth.internal_error"
      );
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
    }
  } catch (err) {
    errorMessage.value = t("auth.internal_error");

    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const handleOAuthMessage = async (event) => {
  if (event.origin !== window.location.origin) return;

  const { status, message } = event.data;

  if (status === "success") {
    successMessage.value = t(message || "auth.login_successful");

    await sessionFetch();

    setTimeout(() => {
      successMessage.value = "";
      activeTab.value = "login";
    }, 3000);
  } else if (status === "error") {
    errorMessage.value = t(message || "auth.login_failed");
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

window.addEventListener("message", handleOAuthMessage);

const loginWithGoogle = () => {
  const popup = window.open("/auth/google", "_blank", "width=500,height=600");
};

const loginWithFacebook = () => {
  const popup = window.open("/auth/facebook", "_blank", "width=500,height=600");
};
console.log(user);
</script>

<template>
  <div>
    <div
      v-if="loggedIn"
      class="w-56 flex border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-charade-900 justify-center flex-col"
    >
      <div class="flex flex-col gap-2 justify-center items-center">
        <h1 class="text-center text-xl font-bold">
          {{ t("Welcome") }}
        </h1>
        <div class="w-14 h-14 rounded-full overflow-hidden relative">
          <div
            class="w-full h-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600"
          >
            {{ userInitials }}
          </div>
        </div>
        <h2 class="text-center text-base">
          {{ userData?.Nume }} {{ userData?.Prenume }}
        </h2>
      </div>
      <div class="mt-4 flex flex-col gap-4">
        <NuxtLinkLocale
          class="bg-charade-950 text-white p-2 rounded-lg text-center items-center justify-center flex gap-2"
          href="/dashboard"
        >
          <UIcon name="i-ph:chalkboard-teacher-thin" size="25" />
          {{ t("Dashboard") }}
        </NuxtLinkLocale>

        <button
          class="bg-red-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
          @click="clear"
        >
          <UIcon name="i-ph:sign-out" size="25" />
          {{ t("Logout") }}
        </button>
      </div>
    </div>

    <div
      v-else
      class="w-96 flex border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-charade-900 justify-center flex-col"
    >
      <div
        class="flex justify-between mb-4 border-b border-gray-300 dark:border-gray-700"
      >
        <button
          :class="{ 'border-b-2 border-charade-950': activeTab === 'login' }"
          class="w-full p-2"
          @click="switchTab('login')"
        >
          {{ t("Login") }}
        </button>
        <button
          :class="{ 'border-b-2 border-charade-950': activeTab === 'register' }"
          class="w-full p-2"
          @click="switchTab('register')"
        >
          {{ t("Register") }}
        </button>
      </div>

      <div v-if="activeTab === 'login'">
        <div class="flex flex-col gap-4">
          <button
            class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
            @click="loginWithGoogle"
          >
            {{ t("Login with Google") }}
            <img src="assets/img/google.svg" class="w-8 h-8" />
          </button>
          <button
            class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
            @click="loginWithFacebook"
          >
            {{ t("Login with Facebook") }}
            <img src="assets/img/facebook.svg" class="w-8 h-8" />
          </button>
          <p class="text-center">{{ t("or") }}</p>
          <form @submit="handleLogin" class="flex flex-col gap-4">
            <input
              v-model="loginEmail"
              @change="email = $event.target.value"
              type="email"
              placeholder="Email"
              autocomplete="email"
              class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
            />
            <input
              v-model="loginPassword"
              @change="password = $event.target.value"
              type="password"
              :placeholder="t('Password')"
              autocomplete="current-password"
              class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
            />
            <button
              type="submit"
              class="bg-charade-950 text-white p-2 rounded-lg"
            >
              {{ t("Login") }}
            </button>
          </form>
        </div>
      </div>

      <div v-if="activeTab === 'register'">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <button
              class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
              @click="loginWithGoogle"
            >
              {{ t("Register with Google") }}
              <img src="assets/img/google.svg" class="w-8 h-8" />
            </button>
            <button
              class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
              @click="loginWithFacebook"
            >
              {{ t("Register with Facebook") }}
              <img src="assets/img/facebook.svg" class="w-8 h-8" />
            </button>
            <p class="text-center">{{ t("or") }}</p>
            <form @submit="handleRegister" class="flex flex-col gap-4">
              <input
                v-model="fullName"
                @change="fullName = $event.target.value"
                type="text"
                :placeholder="t('Nume si Prenume')"
                autocomplete="name"
                class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
              />
              <input
                v-model="email"
                @change="email = $event.target.value"
                type="email"
                placeholder="Email"
                autocomplete="email"
                class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
              />
              <input
                v-model="password"
                @change="password = $event.target.value"
                type="password"
                :placeholder="t('Password')"
                autocomplete="new-password"
                class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
              />
              <button
                type="submit"
                class="bg-charade-950 text-white p-2 rounded-lg"
              >
                {{ t("Register") }}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div v-if="errorMessage" class="text-red-500 text-center">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-green-500 text-center">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>
