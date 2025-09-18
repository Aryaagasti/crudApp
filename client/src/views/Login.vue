<!-- src/views/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold text-green-600 mb-6 text-center">Admin Login</h2>
      <div
        v-if="state.message"
        :class="state.messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
        class="p-4 mb-4 rounded"
      >
        {{ state.message }}
      </div>
      <form @submit.prevent="login" class="space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="block mb-1 text-gray-700 font-medium">Username</label>
          <input
            id="username"
            v-model="state.form.username"
            type="text"
            class="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter Username"
          />
          <p v-if="state.formSubmitted && state.errors.username" class="text-red-500 text-sm mt-1">
            {{ state.errors.username }}
          </p>
        </div>
        <!-- Password -->
        <div>
          <label for="password" class="block mb-1 text-gray-700 font-medium">Password</label>
          <input
            id="password"
            v-model="state.form.password"
            type="password"
            class="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter Password"
          />
          <p v-if="state.formSubmitted && state.errors.password" class="text-red-500 text-sm mt-1">
            {{ state.errors.password }}
          </p>
        </div>
        <!-- Button -->
        <div>
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full"
            :disabled="state.isLoading"
          >
            {{ state.isLoading ? "Logging in..." : "Login" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface FormState {
  username: string;
  password: string;
}

export default {
  setup() {
    const router = useRouter();
    const state = reactive<{
      form: FormState;
      errors: Record<string, string>;
      message: string;
      messageType: "success" | "error" | "";
      isLoading: boolean;
      formSubmitted: boolean;
    }>({
      form: {
        username: "",
        password: "",
      },
      errors: {},
      message: "",
      messageType: "",
      isLoading: false,
      formSubmitted: false,
    });

    const validateForm = () => {
      state.errors = {};
      state.errors.username = !state.form.username.trim() ? "Username is required" : "";
      state.errors.password = !state.form.password.trim() ? "Password is required" : "";
      return Object.values(state.errors).every((e) => !e);
    };

    const login = async () => {
      state.formSubmitted = true;
      state.message = "";
      state.messageType = "";
      if (!validateForm()) {
        state.message = "Please fix the errors in the form";
        state.messageType = "error";
        return;
      }
      state.isLoading = true;
      try {
        const response = await axios.post("/api/admin/auth/login", {
          username: state.form.username.trim(),
          password: state.form.password.trim(),
        });
        const { token, admin } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));
        state.message = "Login successful";
        state.messageType = "success";
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
          router.push("/home");
        }, 1000);
      } catch (error: any) {
        state.message = error.response?.data?.message || "Login failed";
        state.messageType = "error";
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
      } finally {
        state.isLoading = false;
      }
    };

    return {
      state,
      validateForm,
      login,
    };
  },
};
</script>