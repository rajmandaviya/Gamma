<script setup>
const {
  loggedIn,
  user,
  session,
  fetch: sessionFetch,
  clear,
} = useUserSession();

import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();

// State to manage the active tab
const activeTab = ref("login");

// Registration form data
const email = ref("");
const fullName = ref(""); // Combine nume and prenume into fullName
const password = ref("");

// Login form data
const loginEmail = ref("");
const loginPassword = ref("");

// State for error messages
const errorMessage = ref("");

// Function to switch between tabs
const switchTab = (tab) => {
  activeTab.value = tab;
  errorMessage.value = ""; // Reset error message when switching tabs
};

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    console.log({
      email: email.value,
      password: password.value,
      fullName: fullName.value,
    }); // Log the request payload

    // Use the global fetch function for registration
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

    console.log("Response status:", res.status); // Log the response status code

    if (res.ok) {
      const data = await res.json();
      console.log("Registration successful:", data);

      // Automatically login after registration using Nuxt Auth's loginWith method
      await this.$auth.loginWith("local", {
        data: {
          email: email.value,
          password: password.value,
        },
      });

      // Redirect or switch to dashboard after login
      this.$router.push("/dashboard");
    } else {
      const errorData = await res.json();
      console.log("Registration failed:", errorData);
      errorMessage.value = errorData.message || "Failed to register";
    }
  } catch (err) {
    console.error("Failed to register:", err);
    errorMessage.value = err.message || "Failed to register. Please try again.";
  }
};

// Function to handle login
const handleLogin = async (e) => {
  e.preventDefault();
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
      await fetch(); // Refetch user session after login
    } else {
      const error = await res.json();
      errorMessage.value = error.message; // Show error message
    }
  } catch (err) {
    errorMessage.value = "Failed to login. Please try again.";
  }
};

const storeRedirectAndLoginWithGoogle = () => {
  // Set the current URL in a cookie
  document.cookie = `redirectUrl=${window.location.href}; path=/;`;

  // Redirect to Google login
  window.location.href = "/auth/google";
};

const storeRedirectAndLoginWithFacebook = () => {
  // Set the current URL in a cookie
  document.cookie = `redirectUrl=${window.location.href}; path=/;`;

  // Redirect to Facebook login
  window.location.href = "/auth/facebook";
};
</script>

<template>
  <div
    class="w-96 flex border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-charade-900 justify-center flex-col"
  >
    <div v-if="loggedIn">
      <!-- User is logged in -->
      <h1 class="text-center text-lg font-bold">
        {{ t("Welcome") }} {{ user.fullName }}!
      </h1>

      <div class="mt-4 flex flex-col gap-4">
        <!-- Link to /comenzi -->
        <a
          class="bg-charade-950 text-white p-2 rounded-lg text-center"
          href="/comenzi"
        >
          {{ t("My Orders") }}
        </a>

        <!-- Link to /dashboard -->
        <a
          class="bg-charade-950 text-white p-2 rounded-lg text-center"
          href="/dashboard"
        >
          {{ t("Dashboard") }}
        </a>

        <!-- Logout Button -->
        <button class="bg-red-600 text-white p-2 rounded-lg" @click="clear">
          {{ t("Logout") }}
        </button>
      </div>
    </div>

    <div v-else>
      <!-- User is not logged in, show tabs -->
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

      <!-- Conditional content based on activeTab -->
      <div v-if="activeTab === 'login'">
        <div class="flex flex-col gap-4">
          <!-- Social Login buttons -->
          <a
            class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
            href="/auth/google"
            @click="storeRedirectAndLoginWithGoogle"
            >{{ t("Login with Google")
            }}<img src="assets/img/google.svg" class="w-8 h-8"
          /></a>
          <a
            class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
            href="/auth/facebook"
            @click="storeRedirectAndLoginWithFacebook"
            >{{ t("Login with Facebook")
            }}<img src="assets/img/facebook.svg" class="w-8 h-8"
          /></a>
          <p class="text-center">{{ t("or") }}</p>
          <!-- Email and Password fields -->
          <form @submit="handleLogin" class="flex flex-col gap-4">
            <input
              v-model="loginEmail"
              type="email"
              placeholder="Email"
              autocomplete="email"
              class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
            />
            <input
              v-model="loginPassword"
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
        <!-- Registration Form -->
        <div class="flex flex-col gap-4">
          <!-- Social Login buttons -->
          <div class="flex flex-col gap-4">
            <a
              class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
              href="/auth/google"
              @click="storeRedirectAndLoginWithGoogle"
              >{{ t("Register with Google")
              }}<img src="assets/img/google.svg" class="w-8 h-8"
            /></a>
            <a
              class="bg-charade-950 p-2 rounded-lg flex items-center gap-2 justify-center text-white"
              href="/auth/facebook"
              @click="storeRedirectAndLoginWithFacebook"
              >{{ t("Register with Facebook")
              }}<img src="assets/img/facebook.svg" class="w-8 h-8"
            /></a>
            <p class="text-center">{{ t("or") }}</p>
            <form @submit="handleRegister" class="flex flex-col gap-4">
              <input
                v-model="fullName"
                type="text"
                :placeholder="t('Full Name')"
                autocomplete="name"
                class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
              />
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                autocomplete="email"
                class="dark:bg-[#4a4b59] bg-gray-100 rounded-lg p-2 w-full"
              />
              <input
                v-model="password"
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
    </div>
  </div>
</template>
