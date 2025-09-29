
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import axios from 'axios';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/admin/auth/check', { withCredentials: true });
      return response.data.isAuthenticated;
    } catch (error) {
      return false;
    }
  };

  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      next('/login'); 
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});

export default router;
