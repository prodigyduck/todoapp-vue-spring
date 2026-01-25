import api from './api'

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  async register(username, password) {
    const response = await api.post('/auth/register', { username, password })
    return response.data
  }
}
