import { createRouter, createWebHistory } from 'vue-router'
import TodoList from '@/views/TodoList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'TodoList',
      component: TodoList
    },
    {
      path: '/todos',
      redirect: '/'
    }
  ]
})

export default router
