<template>
  <div class="container mx-auto p-4">
    <h2 class="text-xl font-bold text-green-600 mb-4">Add New User</h2>
    <div class="mb-6">
      <input v-model="form.firstName" placeholder="First Name" class="p-2 border rounded w-full mb-2" />
      <input v-model="form.lastName" placeholder="Last Name" class="p-2 border rounded w-full mb-2" />
      <input v-model="form.dateOfBirth" type="date" class="p-2 border rounded w-full mb-2" />
      <input v-model="form.mobileNumber" placeholder="Mobile Number" class="p-2 border rounded w-full mb-2" />
      <textarea v-model="form.address" placeholder="Address" class="p-2 border rounded w-full mb-2"></textarea>
      <button @click="addUser" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Add</button>
    </div>

    <h2 class="text-xl font-bold text-green-600 mb-4">User List</h2>
    <table class="w-full text-left border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">First Name</th>
          <th class="p-2 border">Last Name</th>
          <th class="p-2 border">DOB</th>
          <th class="p-2 border">Mobile</th>
          <th class="p-2 border">Address</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="border">
          <td class="p-2 border">
            <input v-if="user.isEditing" v-model="user.first_name" class="p-1 border rounded w-full" />
            <span v-else>{{ user.first_name }}</span>
          </td>
          <td class="p-2 border">
            <input v-if="user.isEditing" v-model="user.last_name" class="p-1 border rounded w-full" />
            <span v-else>{{ user.last_name }}</span>
          </td>
          <td class="p-2 border">
            <input v-if="user.isEditing" v-model="user.date_of_birth" type="date" class="p-1 border rounded w-full" />
            <span v-else>{{ user.date_of_birth }}</span>
          </td>
          <td class="p-2 border">
            <input v-if="user.isEditing" v-model="user.mobile_number" class="p-1 border rounded w-full" />
            <span v-else>{{ user.mobile_number }}</span>
          </td>
          <td class="p-2 border">
            <textarea v-if="user.isEditing" v-model="user.address" class="p-1 border rounded w-full"></textarea>
            <span v-else>{{ user.address }}</span>
          </td>
          <td class="p-2 border">
            <button v-if="!user.isEditing" @click="editUser(user.id)" class="bg-blue-500 text-white p-1 rounded mr-2">Edit</button>
            <button v-if="user.isEditing" @click="updateUser(user.id)" class="bg-yellow-500 text-white p-1 rounded mr-2">Update</button>
            <button @click="deleteUser(user.id)" class="bg-red-500 text-white p-1 rounded">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { ref } from 'vue';

export default {
  setup() {
    const users = ref([]);
    const form = ref({ firstName: '', lastName: '', dateOfBirth: '', mobileNumber: '', address: '' });

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        users.value = data.map(user => ({ ...user, isEditing: false })); // Add isEditing flag
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const addUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: form.value.firstName,
            last_name: form.value.lastName,
            date_of_birth: form.value.dateOfBirth,
            mobile_number: form.value.mobileNumber,
            address: form.value.address,
          }),
        });
        if (!response.ok) throw new Error('Failed to add user');
        form.value = { firstName: '', lastName: '', dateOfBirth: '', mobileNumber: '', address: '' };
        fetchUsers();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };

    const deleteUser = async (id) => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    const editUser = (id) => {
      users.value = users.value.map(user =>
        user.id === id ? { ...user, isEditing: true } : { ...user, isEditing: false }
      );
    };

    const updateUser = async (id) => {
      const user = users.value.find(u => u.id === id);
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: user.first_name,
            last_name: user.last_name,
            date_of_birth: user.date_of_birth,
            mobile_number: user.mobile_number,
            address: user.address,
          }),
        });
        if (!response.ok) throw new Error('Failed to update user');
        users.value = users.value.map(user => ({ ...user, isEditing: false }));
        fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    fetchUsers();

    return { users, form, addUser, deleteUser, editUser, updateUser };
  },
};
</script>
<style scoped>
</style>