<!-- src/views/Home.vue -->
<template>
  <div class="container mx-auto p-4">
    <!-- Logout Button -->
    <div class="flex justify-end mb-4">
      <button
        @click="logout"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
    <!-- Add User Form -->
    <h2 class="text-2xl font-bold text-green-600 mb-4">Add New User</h2>
    <div
      v-if="state.message"
      :class="state.messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
      class="p-4 mb-4 rounded"
    >
      {{ state.message }}
    </div>
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block mb-1 text-gray-700 font-medium">First Name</label>
          <input
            id="firstName"
            v-model="state.form.firstName"
            class="p-2 border rounded w-full"
            placeholder="Enter First Name"
          />
          <p v-if="state.formSubmitted && state.errors.first_name" class="text-red-500 text-sm mt-1">
            {{ state.errors.first_name }}
          </p>
        </div>
        <!-- Last Name -->
        <div>
          <label for="lastName" class="block mb-1 text-gray-700 font-medium">Last Name</label>
          <input
            id="lastName"
            v-model="state.form.lastName"
            class="p-2 border rounded w-full"
            placeholder="Enter Last Name"
          />
          <p v-if="state.formSubmitted && state.errors.last_name" class="text-red-500 text-sm mt-1">
            {{ state.errors.last_name }}
          </p>
        </div>
        <!-- DOB -->
        <div>
          <label for="dob" class="block mb-1 text-gray-700 font-medium">Date of Birth</label>
          <input
            id="dob"
            type="date"
            v-model="state.form.dateOfBirth"
            class="p-2 border rounded w-full"
          />
          <p v-if="state.formSubmitted && state.errors.date_of_birth" class="text-red-500 text-sm mt-1">
            {{ state.errors.date_of_birth }}
          </p>
        </div>
        <!-- Mobile -->
        <div>
          <label for="mobile" class="block mb-1 text-gray-700 font-medium">Mobile Number</label>
          <input
            id="mobile"
            v-model="state.form.mobileNumber"
            class="p-2 border rounded w-full"
            placeholder="Enter Mobile Number"
          />
          <p v-if="state.formSubmitted && state.errors.mobile_number" class="text-red-500 text-sm mt-1">
            {{ state.errors.mobile_number }}
          </p>
        </div>
        <!-- Address -->
        <div class="md:col-span-2">
          <label for="address" class="block mb-1 text-gray-700 font-medium">Address</label>
          <textarea
            id="address"
            v-model="state.form.address"
            class="p-2 border rounded w-full h-24"
            placeholder="Enter Address"
          ></textarea>
          <p v-if="state.formSubmitted && state.errors.address" class="text-red-500 text-sm mt-1">
            {{ state.errors.address }}
          </p>
        </div>
      </div>
      <!-- Button -->
      <div class="mt-6">
        <button
          @click="addUser"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full md:w-auto"
          :disabled="state.isLoading"
        >
          {{ state.isLoading ? "Adding..." : "Add User" }}
        </button>
      </div>
    </div>
    <!-- User List -->
    <h2 class="text-2xl font-bold text-green-600 mb-4">User List</h2>
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <div class="flex mb-4 p-4 space-x-2">
        <input
          v-model="state.search"
          placeholder="Search by Name"
          class="p-2 border rounded w-full"
          @input="handleSearch"
        />
        <select v-model="state.sortColumn" class="p-2 border rounded" @change="handleSortChange">
          <option value="">Sort by</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
          <option value="date_of_birth">DOB</option>
        </select>
        <select v-model="state.sortOrder" class="p-2 border rounded" @change="fetchUsers">
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
      <table class="w-full text-left">
        <thead class="bg-gray-200">
          <tr>
            <th class="p-3">First Name</th>
            <th class="p-3">Last Name</th>
            <th class="p-3">DOB</th>
            <th class="p-3">Mobile</th>
            <th class="p-3">Address</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in state.users" :key="user.id" class="border-b">
            <td class="p-3">
              <input
                v-if="user.isEditing"
                v-model="user.first_name"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ user.first_name }}</span>
            </td>
            <td class="p-3">
              <input
                v-if="user.isEditing"
                v-model="user.last_name"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ user.last_name }}</span>
            </td>
            <td class="p-3">
              <input
                v-if="user.isEditing"
                type="date"
                v-model="user.date_of_birth"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ formatDate(user.date_of_birth) }}</span>
            </td>
            <td class="p-3">
              <input
                v-if="user.isEditing"
                v-model="user.mobile_number"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ user.mobile_number }}</span>
            </td>
            <td class="p-3">
              <textarea
                v-if="user.isEditing"
                v-model="user.address"
                class="p-2 border rounded w-full"
              ></textarea>
              <span v-else>{{ user.address }}</span>
            </td>
            <td class="p-3">
              <div class="flex space-x-2">
                <button
                  v-if="!user.isEditing"
                  @click="editUser(user.id)"
                  class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  v-if="user.isEditing"
                  @click="updateUser(user.id)"
                  class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  v-if="user.isEditing"
                  @click="cancelEdit(user.id)"
                  class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4 space-x-2">
        <button
          @click="decrementPage"
          :disabled="state.currentPage === 1"
          class="bg-gray-500 text-white px-3 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          v-for="page in state.totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 rounded',
            state.currentPage === page
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="incrementPage"
          :disabled="state.currentPage === state.totalPages"
          class="bg-gray-500 text-white px-3 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  mobile_number: string;
  address: string;
  isEditing?: boolean;
  originalData?: Partial<User>;
}

interface FormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobileNumber: string;
  address: string;
}

export default {
  setup() {
    const router = useRouter();
    const state = reactive<{
      users: User[];
      form: FormState;
      errors: Record<string, string>;
      search: string;
      sortColumn: string;
      sortOrder: string;
      currentPage: number;
      message: string;
      messageType: "success" | "error" | "";
      isLoading: boolean;
      formSubmitted: boolean;
      totalPages: number;
      searchTimeout: any;
    }>({
      users: [],
      form: {
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        mobileNumber: "",
        address: "",
      },
      errors: {},
      search: "",
      sortColumn: "",
      sortOrder: "ASC",
      currentPage: 1,
      message: "",
      messageType: "",
      isLoading: false,
      formSubmitted: false,
      totalPages: 1,
      searchTimeout: null,
    });

    const validateForm = () => {
      state.errors = {};
      state.errors.first_name = !state.form.firstName.trim() ? "First name is required" : "";
      state.errors.last_name = !state.form.lastName.trim() ? "Last name is required" : "";
      state.errors.date_of_birth = !state.form.dateOfBirth || !/^\d{4}-\d{2}-\d{2}$/.test(state.form.dateOfBirth)
        ? "Valid date (YYYY-MM-DD) required"
        : "";
      state.errors.mobile_number = !/^\d{10}$/.test(state.form.mobileNumber.trim())
        ? "10 digits required"
        : "";
      state.errors.address = !state.form.address.trim() ? "Address is required" : "";
      return Object.values(state.errors).every((e) => !e);
    };

    const formatDate = (date: string) => {
      return date ? new Date(date).toLocaleDateString() : "";
    };

    const handleSearch = () => {
      clearTimeout(state.searchTimeout);
      state.searchTimeout = setTimeout(() => {
        state.currentPage = 1;
        fetchUsers();
      }, 500);
    };

    const handleSortChange = () => {
      state.currentPage = 1;
      fetchUsers();
    };

    const incrementPage = async () => {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        await fetchUsers();
      }
    };

    const decrementPage = async () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        await fetchUsers();
      }
    };

    const goToPage = async (page: number) => {
      if (page >= 1 && page <= state.totalPages) {
        state.currentPage = page;
        await fetchUsers();
      }
    };

    const addUser = async () => {
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
        const response = await axios.post(
          "/api/users",
          {
            first_name: state.form.firstName.trim(),
            last_name: state.form.lastName.trim(),
            date_of_birth: state.form.dateOfBirth,
            mobile_number: state.form.mobileNumber.trim(),
            address: state.form.address.trim(),
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        state.form = {
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          mobileNumber: "",
          address: "",
        };
        state.errors = {};
        state.formSubmitted = false;
        state.message = response.data.message || "User created successfully";
        state.messageType = "success";
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
        await fetchUsers();
      } catch (error: any) {
        state.message = error.response?.data?.message || "Error adding user";
        state.messageType = "error";
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          router.push("/login");
        }
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
      } finally {
        state.isLoading = false;
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `/api/users?page=${state.currentPage}&limit=5&search=${encodeURIComponent(state.search)}&sortBy=${state.sortColumn || "id"}&order=${state.sortOrder}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        state.users = response.data.data || [];
        state.totalPages = response.data.pagination?.totalPages || 1;
      } catch (error: any) {
        state.message = error.response?.data?.message || "Error fetching users";
        state.messageType = "error";
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          router.push("/login");
        }
      }
    };

    const editUser = (id?: number) => {
      if (id === undefined) return;
      state.users.forEach(user => {
        if (user.isEditing && user.id !== id) {
          cancelEdit(user.id);
        }
      });
      state.users = state.users.map((user) =>
        user.id === id ? { ...user, isEditing: true, originalData: { ...user } } : user
      );
    };

    const updateUser = async (id?: number) => {
      if (id === undefined) return;
      const user = state.users.find((u) => u.id === id);
      if (!user) return;
      state.isLoading = true;
      try {
        const response = await axios.put(
          `/api/users/${id}`,
          {
            first_name: user.first_name.trim(),
            last_name: user.last_name.trim(),
            date_of_birth: user.date_of_birth,
            mobile_number: user.mobile_number.trim(),
            address: user.address.trim(),
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        state.message = response.data.message || "User updated successfully";
        state.messageType = "success";
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
        await fetchUsers();
      } catch (error: any) {
        state.message = error.response?.data?.message || "Error updating user";
        state.messageType = "error";
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          router.push("/login");
        }
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
      } finally {
        state.isLoading = false;
      }
    };

    const deleteUser = async (id?: number) => {
      if (id === undefined) return;
      if (!confirm("Are you sure you want to delete this user?")) {
        return;
      }
      state.isLoading = true;
      try {
        const response = await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        state.message = response.data.message || "User deleted successfully";
        state.messageType = "success";
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
        await fetchUsers();
      } catch (error: any) {
        state.message = error.response?.data?.message || "Error deleting user";
        state.messageType = "error";
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          router.push("/login");
        }
        setTimeout(() => {
          state.message = "";
          state.messageType = "";
        }, 3000);
      } finally {
        state.isLoading = false;
      }
    };

    const cancelEdit = (id?: number) => {
      if (id === undefined) return;
      const user = state.users.find((u) => u.id === id);
      if (!user) return;
      if (user.originalData) {
        Object.assign(user, user.originalData);
        delete user.originalData;
      }
      user.isEditing = false;
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      router.push("/login");
    };

    fetchUsers();

    return {
      state,
      validateForm,
      formatDate,
      addUser,
      editUser,
      updateUser,
      deleteUser,
      incrementPage,
      decrementPage,
      cancelEdit,
      goToPage,
      handleSearch,
      handleSortChange,
      fetchUsers,
      logout,
    };
  },
};
</script>