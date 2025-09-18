import {createRouter, createWebHistory}  from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [{path: '/', redirect:'/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home, meta: {requiresAuth: true}},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from,next)=>{
    const token = localStorage.getItem('token')
    if(to.meta.requiresAuth && !token){
        next('/login')
    }
    else{
        next()
    }
})

export default router