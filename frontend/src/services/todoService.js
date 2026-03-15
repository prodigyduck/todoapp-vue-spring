import api from './api'

export const todoService = {
  async getTodos() {
    const response = await api.get('/todos')
    return response.data
  },

  async getAll() {
    return this.getTodos()
  },

  async getMyDay() {
    const response = await api.get('/todos/myday')
    return response.data
  },

  async getImportant() {
    const response = await api.get('/todos/important')
    return response.data
  },

  async getByListName(listName) {
    const response = await api.get(`/todos/list/${encodeURIComponent(listName)}`)
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

  async toggleCompleted(id) {
    return this.toggle(id)
  },

  async toggleImportant(id) {
    const response = await api.patch(`/todos/${id}/important`)
    return response.data
  },

  async toggleMyDay(id) {
    const response = await api.patch(`/todos/${id}/myday`)
    return response.data
  },

  async delete(id) {
    await api.delete(`/todos/${id}`)
  }
}
