import api from './api'

export const todoService = {
  async getAll() {
    const response = await api.get('/todos')
    return response.data
  },

  async create(todo) {
    const response = await api.post('/todos', todo)
    return response.data
  },

  async update(id, todo) {
    const response = await api.put(`/todos/${id}`, todo)
    return response.data
  },

  async toggle(id) {
    const response = await api.patch(`/todos/${id}/toggle`)
    return response.data
  },

  async delete(id) {
    await api.delete(`/todos/${id}`)
  }
}
