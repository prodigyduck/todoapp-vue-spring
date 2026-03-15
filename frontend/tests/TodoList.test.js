import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TodoList from '@/views/TodoList.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/login', name: 'login' }] })

vi.mock('@/services/todoService', () => {
  return {
    todoService: {
      getAll: vi.fn(() => Promise.resolve([{ id: 1, title: 'Test', description: '', completed: false }])),
      update: vi.fn((id, payload) => Promise.resolve({ id, ...payload, completed: false })),
      toggle: vi.fn((id) => Promise.resolve({ id, title: 'Test', description: '', completed: true })),
      create: vi.fn((payload) => Promise.resolve({ id: 2, ...payload, completed: false })),
      delete: vi.fn((id) => Promise.resolve())
    }
  }
})

describe('TodoList', () => {
  it('renders todos and shows edit UI when clicking edit', async () => {
    const pinia = createPinia()
    // jsdom provides a localStorage implementation on window
    window.localStorage.setItem('username', 'tester')

    const wrapper = mount(TodoList, {
      global: {
        plugins: [pinia, router, vuetify]
      }
    })
    await new Promise((r) => setTimeout(r, 0))

    expect(wrapper.text()).toContain('My Tasks')
    expect(wrapper.text()).toContain('Test')

    const editBtn = wrapper.find('button')
    await editBtn.trigger('click')
    
    expect(wrapper.html()).toContain('placeholder="Title"')
  })
})
