import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    component: () => import('../pages/HomePage')
  },
  {
    path: "/signup",
    component: () => import('../pages/SignUpPage')
  },
  {
    path: "/login",
    component: () => import('../pages/LoginPage')
  },
  {
    path: "/user/:id",
    component: () => import('../pages/UserPage')
  },
  {
    path: "/activate/:token",
    component: () => import('../pages/AccountActivationPage')
  },
]

const router = createRouter({ routes, history: createWebHistory() })

export default router
