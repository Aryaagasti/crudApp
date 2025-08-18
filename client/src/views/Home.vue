<template>
  <div class="container mx-auto p-4">
    <!-- Add User Form -->
    <h2 class="text-2xl font-bold text-white-600 mb-4">Add New User</h2>
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- First Name -->
        <div>
          <label for="firstName" class="block mb-1 text-gray-700 font-medium">First Name</label>
          <input
            id="firstName"
            v-model="form.firstName"
            class="p-2 border rounded w-full"
            placeholder="Enter First Name"
          />
          <p v-if="errors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block mb-1 text-gray-700 font-medium">Last Name</label>
          <input
            id="lastName"
            v-model="form.lastName"
            class="p-2 border rounded w-full"
            placeholder="Enter Last Name"
          />
          <p v-if="errors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</p>
        </div>

        <!-- Date of Birth -->
        <div>
          <label for="dob" class="block mb-1 text-gray-700 font-medium">Date of Birth</label>
          <input
            id="dob"
            type="date"
            v-model="form.dateOfBirth"
            class="p-2 border rounded w-full"
          />
          <p v-if="errors.dateOfBirth" class="text-red-500 text-sm mt-1">{{ errors.dateOfBirth }}</p>
        </div>

        <!-- Mobile Number -->
        <div>
          <label for="mobile" class="block mb-1 text-gray-700 font-medium">Mobile Number</label>
          <input
            id="mobile"
            v-model="form.mobileNumber"
            class="p-2 border rounded w-full"
            placeholder="10 digit number"
          />
          <p v-if="errors.mobileNumber" class="text-red-500 text-sm mt-1">{{ errors.mobileNumber }}</p>
        </div>

        <!-- Address (full width) -->
        <div class="md:col-span-2">
          <label for="address" class="block mb-1 text-gray-700 font-medium">Address</label>
          <textarea
            id="address"
            v-model="form.address"
            class="p-2 border rounded w-full"
            placeholder="Enter Address"
          ></textarea>
          <p v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</p>
        </div>
      </div>

      <!-- Button -->
      <div class="mt-4">
        <button
          @click="addUser"
          class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-white-600 transition w-full md:w-auto"
        >
          Add User
        </button>
      </div>
    </div>

    <!-- User List -->
    <h2 class="text-2xl font-bold text-white-600 mb-4">User List</h2>
    <div class="overflow-x-auto">
      <table class="w-full text-left border shadow-md rounded-lg overflow-hidden min-w-[600px]">
        <thead>
          <tr class="bg-yellow-600 text-white">
            <th class="p-3">First Name</th>
            <th class="p-3">Last Name</th>
            <th class="p-3">DOB</th>
            <th class="p-3">Mobile</th>
            <th class="p-3">Address</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-100 transition"
          >
            <!-- First Name -->
            <td class="p-3 border">
              <input
                v-if="user.isEditing"
                v-model="user.first_name"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ user.first_name }}</span>
            </td>

            <!-- Last Name -->
            <td class="p-3 border">
              <input
                v-if="user.isEditing"
                v-model="user.last_name"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ user.last_name }}</span>
            </td>

            <!-- DOB -->
            <td class="p-3 border">
              <input
                v-if="user.isEditing"
                type="date"
                v-model="user.date_of_birth"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ formatDateForDisplay(user.date_of_birth) }}</span>
            </td>

            <!-- Mobile -->
            <td class="p-3 border">
              <input
                v-if="user.isEditing"
                v-model="user.mobile_number"
                class="p-2 border rounded w-full"
              />
              <span v-else>{{ user.mobile_number }}</span>
            </td>

            <!-- Address -->
            <td class="p-3 border">
              <textarea
                v-if="user.isEditing"
                v-model="user.address"
                class="p-2 border rounded w-full"
              ></textarea>
              <span v-else>{{ user.address }}</span>
            </td>

            <!-- Actions -->
            <td class="p-3 border text-center flex flex-wrap gap-2 justify-center">
              <button
                v-if="!user.isEditing"
                @click="editUser(user.id)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              <button
                v-if="user.isEditing"
                @click="updateUser(user.id)"
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              >
                Update
              </button>
              <button
                v-if="user.isEditing"
                @click="cancelEdit(user.id)"
                class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                @click="deleteUser(user.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script>
import { ref, reactive } from "vue";

export default {
  setup() {
    const users = ref([]);
    const form = reactive({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      mobileNumber: "",
      address: "",
    });
    const errors = reactive({});

    // Validate inputs
    const validateForm = () => {
      errors.firstName = !form.firstName ? "First name is required" : "";
      errors.lastName = !form.lastName ? "Last name is required" : "";
      errors.dateOfBirth = !form.dateOfBirth ? "Date of birth is required" : "";
      errors.mobileNumber = !/^[0-9]{10}$/.test(form.mobileNumber)
        ? "Enter valid 10-digit mobile"
        : "";
      errors.address = !form.address ? "Address is required" : "";

      return !Object.values(errors).some((e) => e);
    };

    const formatDateForDisplay = (dateStr) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        users.value = data.map((u) => ({ ...u, isEditing: false }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const addUser = async () => {
      if (!validateForm()) return;
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: form.firstName,
            last_name: form.lastName,
            date_of_birth: form.dateOfBirth,
            mobile_number: form.mobileNumber,
            address: form.address,
          }),
        });
        if (!response.ok) throw new Error("Failed to add user");
        Object.assign(form, {
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          mobileNumber: "",
          address: "",
        });
        fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
      }
    };

    const editUser = (id) => {
      users.value = users.value.map((user) =>
        user.id === id ? { ...user, isEditing: true, originalData: { ...user } } : user
      );
    };

    const cancelEdit = (id) => {
      users.value = users.value.map((user) =>
        user.id === id ? { ...user.originalData, isEditing: false } : user
      );
    };

    const updateUser = async (id) => {
      const user = users.value.find((u) => u.id === id);
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
        fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };

    const deleteUser = async (id) => {
      try {
        const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete user");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    fetchUsers();

    return {
      users,
      form,
      errors,
      addUser,
      deleteUser,
      editUser,
      updateUser,
      cancelEdit,
      formatDateForDisplay,
    };
  },
};
</script>
