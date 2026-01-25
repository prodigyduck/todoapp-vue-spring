<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="6" rounded="lg">
          <v-card-title class="text-center pa-6 pb-2">
            <h1 class="text-h4 font-weight-bold">Register</h1>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="username"
                label="Username"
                placeholder="Choose a username"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                required
                class="mb-4"
              />

              <v-text-field
                v-model="password"
                label="Password"
                placeholder="Choose a password"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
                required
                minlength="6"
                class="mb-4"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                variant="outlined"
                required
                class="mb-4"
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
                density="compact"
              >
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                block
                size="large"
                class="text-body-1 font-weight-bold"
              >
                Register
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <p class="text-body-2 text-grey-darken-1 text-center flex-grow-1">
              Already have an account?
              <router-link to="/login" class="text-primary font-weight-bold">Login</router-link>
            </p>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const handleRegister = async () => {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  try {
    await authStore.register(username.value, password.value)
    router.push('/todos')
  } catch (err) {
    error.value = err.response?.data?.message || 'Username already exists'
  }
}
</script>
