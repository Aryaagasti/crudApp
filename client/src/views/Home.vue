<template>
  <div class="container mx-auto p-4">
    <!-- Add User Form -->
    <h2 class="text-2xl font-bold text-green-600 mb-4">Add New User</h2>
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block mb-1 text-gray-700 font-medium"
            >First Name</label
          >
          <input
            id="firstName"
            v-model="state.form.firstName"
            class="p-2 border rounded w-full"
            placeholder="Enter First Name"
          />
          <p v-if="state.errors.firstName" class="text-red-500 text-sm mt-1">
            {{ state.errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block mb-1 text-gray-700 font-medium"
            >Last Name</label
          >
          <input
            id="lastName"
            v-model="state.form.lastName"
            class="p-2 border rounded w-full"
            placeholder="Enter Last Name"
          />
          <p v-if="state.errors.lastName" class="text-red-500 text-sm mt-1">
            {{ state.errors.lastName }}
          </p>
        </div>

        <!-- DOB -->
        <div>
          <label for="dob" class="block mb-1 text-gray-700 font-medium"
            >Date of Birth</label
          >
          <input
            id="dob"
            type="date"
            v-model="state.form.dateOfBirth"
            class="p-2 border rounded w-full"
          />
          <p v-if="state.errors.dateOfBirth" class="text-red-500 text-sm mt-1">
            {{ state.errors.dateOfBirth }}
          </p>
        </div>

        <!-- Mobile -->
        <div>
          <label for="mobile" class="block mb-1 text-gray-700 font-medium"
            >Mobile Number</label
          >
          <input
            id="mobile"
            v-model="state.form.mobileNumber"
            class="p-2 border rounded w-full"
            placeholder="Enter Mobile Number"
          />
          <p v-if="state.errors.mobileNumber" class="text-red-500 text-sm mt-1">
            {{ state.errors.mobileNumber }}
          </p>
        </div>

        <!-- Address -->
        <div class="md:col-span-2">
          <label for="address" class="block mb-1 text-gray-700 font-medium"
            >Address</label
          >
          <textarea
            id="address"
            v-model="state.form.address"
            class="p-2 border rounded w-full h-24"
            placeholder="Enter Address"
          ></textarea>
          <p v-if="state.errors.address" class="text-red-500 text-sm mt-1">
            {{ state.errors.address }}
          </p>
        </div>
      </div>

      <!-- Button -->
      <div class="mt-6">
        <button
          @click="addUser"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full md:w-auto"
          :disabled="hasErrors"
        >
          Add User
        </button>
      </div>
    </div>

    <!-- User List -->
    <h2 class="text-2xl font-bold text-green-600 mb-4">User List</h2>
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <div class="flex mb-4 p-4">
        <input
          v-model="state.search"
          placeholder="Search by Name"
          class="p-2 border rounded w-full mr-2"
        />
        <select v-model="state.sortColumn" class="p-2 border rounded">
          <option value="">Sort by</option>
          <option value="first_name">First Name</option>
          <option value="date_of_birth">DOB</option>
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
          <tr v-for="user in paginatedUsers" :key="user.id" class="border-b">
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
              <button
                v-if="!user.isEditing"
                @click="editUser(user.id)"
                class="bg-blue-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                v-if="user.isEditing"
                @click="updateUser(user.id)"
                class="bg-yellow-500 text-white p-2 rounded"
              >
                Update
              </button>
              <button
                @click="deleteUser(user.id)"
                class="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center mt-4">
        <button
          @click="currentPage--"
          :disabled="state.currentPage === 1"
          class="bg-gray-500 text-white p-2 rounded mr-2"
        >
          Previous
        </button>
        <span>Page {{ state.currentPage }} of {{ totalPages }}</span>
        <button
          @click="currentPage++"
          :disabled="state.currentPage === totalPages"
          class="bg-gray-500 text-white p-2 rounded ml-2"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, computed } from "vue";

interface User {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  mobile_number: string;
  address: string;
  isEditing?: boolean;
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
    const state = reactive<{
      users: User[];
      form: FormState;
      errors: Record<string, string>;
      search: string;
      sortColumn: string;
      currentPage: number;
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
      currentPage: 1,
    });

    const validateForm = () => {
      state.errors.firstName = !state.form.firstName ? "Required" : "";
      state.errors.lastName = !state.form.lastName ? "Required" : "";
      state.errors.dateOfBirth = !state.form.dateOfBirth ? "Required" : "";
      state.errors.mobileNumber = !/^\d{10}$/.test(state.form.mobileNumber)
        ? "10 digits required"
        : "";
      state.errors.address = !state.form.address ? "Required" : "";
      return Object.values(state.errors).every((e) => !e);
    };

    const formatDate = (date: string) => {
      return date ? new Date(date).toLocaleDateString() : "";
    };

    const filteredUsers = computed(() =>
      state.users.filter(
        (u) =>
          u.first_name.includes(state.search) ||
          u.last_name.includes(state.search)
      )
    );

    const sortedUsers = computed(() => {
      const sorted = [...filteredUsers.value];
      if (state.sortColumn === "first_name")
        sorted.sort((a, b) => a.first_name.localeCompare(b.first_name));
      if (state.sortColumn === "date_of_birth")
        sorted.sort(
          (a, b) =>
            new Date(a.date_of_birth).getTime() -
            new Date(b.date_of_birth).getTime()
        );
      return sorted;
    });

    const paginatedUsers = computed(() => {
      const start = (state.currentPage - 1) * 5;
      return sortedUsers.value.slice(start, start + 5);
    });

    const totalPages = computed(() => Math.ceil(sortedUsers.value.length / 5));

    const addUser = async () => {
      if (!validateForm()) return;
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: state.form.firstName,
            last_name: state.form.lastName,
            date_of_birth: state.form.dateOfBirth,
            mobile_number: state.form.mobileNumber,
            address: state.form.address,
          }),
        });
        if (!response.ok) throw new Error("Failed to add user");
        state.form = {
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          mobileNumber: "",
          address: "",
        };
        await fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Network response was not ok");
        state.users = await response.json();
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    const editUser = (id?: number) => {
      if (id === undefined) return; // guard clause
      state.users = state.users.map((user) =>
        user.id === id ? { ...user, isEditing: true } : user
      );
    };

    const updateUser = async (id?: number) => {
      if (id === undefined) return; // guard clause
      const user = state.users.find((u) => u.id === id);
      if (!user) return;
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: user.first_name,
            last_name: user.last_name,
            date_of_birth: user.date_of_birth,
            mobile_number: user.mobile_number,
            address: user.address,
          }),
        });
        if (!response.ok) throw new Error("Failed to update user");
        await fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };

    const deleteUser = async (id?: number) => {
      if (id === undefined) return; // guard clause
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete user");
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    const currentPage = computed({
      get: () => state.currentPage,
      set: (value: number) => {
        state.currentPage = value;
        fetchUsers();
      },
    });

    const hasErrors = computed(() =>
      Object.values(state.errors).some((e) => e)
    );

    fetchUsers();

    return {
      state,
      validateForm,
      formatDate,
      paginatedUsers,
      totalPages,
      addUser,
      editUser,
      updateUser,
      deleteUser,
      currentPage,
      hasErrors,
    };
  },
};
</script>
