<template>
  <div class="login-container">
    <div class="background-pattern"></div>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card 
            class="login-card" 
            elevation="8" 
            rounded="xl"
            variant="elevated"
          >
            <v-card-title class="text-center pa-8 pb-4">
              <div class="logo-container mb-4">
                <v-icon 
                  icon="mdi-check-circle-outline" 
                  size="48" 
                  color="primary"
                  class="pulse-animation"
                />
              </div>
              <h1 class="text-h4 font-weight-light mb-2">Welcome Back</h1>
              <p class="text-body-2 text-grey-darken-1">Sign in to continue to your tasks</p>
            </v-card-title>

            <v-card-text class="pa-6 pt-2">
              <v-form @submit.prevent="handleLogin" class="login-form">
                <v-text-field
                  v-model="username"
                  label="Username"
                  placeholder="Enter your username"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  bg-color="grey-lighten-5"
                  required
                  class="mb-6"
                  color="primary"
                  :error-messages="username.length > 0 && username.length < 3 ? ['Username too short'] : []"
                  :success-messages="checkUsernameAvailability && usernameAvailable && !error.value ? ['Username is available'] : []"
                  @update:model-value="checkUsernameAvailability"
                  :loading="checkUsernameAvailability && username.value.length > 2"
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  placeholder="Enter your password"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  bg-color="grey-lighten-5"
                  required
                  class="mb-6"
                  color="primary"
                  :messages="passwordStrength.feedback ? passwordStrength.feedback : []"
                  :append-inner-icon="passwordStrength.color ? `mdi-${passwordStrength.score >= 4 ? 'check' : 'alert'}-circle` : ''"
                >
                  <!-- Password strength indicator -->
                  <div v-if="passwordStrength.score > 0" class="password-strength">
                    <div class="strength-bar">
                      <div 
                        class="strength-fill" 
                        :style="{ width: passwordStrength.score * 20 + '%', backgroundColor: passwordStrength.color }"
                      ></div>
                    </div>
                    <small class="strength-text" :style="{ color: passwordStrength.color }">
                      {{ passwordStrength.text }}
                    </small>
                  </div>
                </v-text-field>

                <v-expand-transition>
                  <v-alert
                    v-if="error"
                    type="error"
                    variant="tonal"
                    class="mb-6"
                    density="comfortable"
                    rounded="lg"
                    prominent
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-alert-circle" class="me-2" />
                    </template>
                    {{ error }}
                  </v-alert>
                </v-expand-transition>

                <v-btn
                  type="submit"
                  color="primary"
                  variant="elevated"
                  block
                  size="large"
                  class="login-btn text-body-1 font-weight-medium"
                  rounded="lg"
                  elevation="2"
                  :loading="loading"
                  :disabled="loading || !username.value.trim() || !password.value.trim() || passwordStrength.score < 4"
                >
                  <v-icon start icon="mdi-login" class="me-2" />
                  <span v-if="!loading">Sign In</span>
                  <span v-else>
                    <v-progress-circular
                      indeterminate
                      size="20"
                      width="3"
                      class="mr-2"
                    />
                    Signing in...
                  </span>
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-8 pt-0">
              <p class="text-body-2 text-grey-darken-1 text-center">
                New to our platform?
                <router-link 
                  to="/register" 
                  class="text-primary font-weight-medium text-decoration-none ml-1"
                >
                  Create an account
                </router-link>
              </p>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
                    {{ error }}
                  </v-alert>
                </v-expand-transition>

                <v-btn
                  type="submit"
                  color="primary"
                  variant="elevated"
                  block
                  size="large"
                  class="login-btn text-body-1 font-weight-medium"
                  rounded="lg"
                  elevation="2"
                >
                  <v-icon start icon="mdi-login" class="me-2" />
                  Sign In
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-8 pt-0">
              <p class="text-body-2 text-grey-darken-1 text-center">
                New to our platform?
                <router-link 
                  to="/register" 
                  class="text-primary font-weight-medium text-decoration-none ml-1"
                >
                  Create an account
                </router-link>
              </p>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return { score: 0, text: '', color: '' }
  
  let score = 0
  let feedback = []
  
  // Length check
  if (pwd.length < 8) {
    feedback.push('Password too short')
    return { score: 1, text: 'Weak', color: '#F44336' }
  }
  if (pwd.length >= 8) score += 1
  
  // Complexity checks
  if (/[A-Z]/.test(pwd)) feedback.push('Add uppercase letter')
  if (/[a-z]/.test(pwd)) feedback.push('Add lowercase letter')
  if (/[0-9]/.test(pwd)) feedback.push('Add number')
  score += 2
  
  // Special character bonus
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1
  
  // Determine strength
  let strength = 'Weak'
  let color = '#F44336'
  if (score >= 4) {
    strength = 'Medium'
    color = '#FF9800'
  }
  if (score >= 6) {
    strength = 'Strong'
    color = '#4CAF50'
  }
  
  return { score, text: strength, color, feedback }
})

// Username availability check (debounced)
const checkUsernameAvailability = async () => {
  // Simulate API call with debounce
  loading.value = true
  try {
    // Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const isAvailable = username.value.length > 3 && !['admin', 'user', 'test'].includes(username.value.toLowerCase())
    
    if (isAvailable) {
      error.value = 'Username is available'
    } else {
      error.value = 'Username is already taken'
    }
  } catch (err) {
    error.value = 'Failed to check username'
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Please enter both username and password'
    return
  }
  
  if (passwordStrength.score < 4) {
    error.value = 'Password is too weak. Please choose a stronger password.'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.login(username.value, password.value)
    router.push('/todos')
  } catch (err) {
    error.value = 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px);
  background-size: 50px 50px;
  animation: float 20s ease-in-out infinite;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.login-form {
  margin-top: 16px;
}

.login-btn {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

/* Password strength indicator */
.password-strength {
  margin-top: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.strength-bar {
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  overflow: hidden;
  transition: width 0.3s ease;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  transition: color 0.3s ease;
}

/* Field animations */
.v-text-field {
  transition: all 0.3s ease;
}

.v-text-field--focused {
  transform: translateY(-2px);
}

/* Success message */
.v-messages {
  transition: all 0.3s ease;
}

.v-messages--success {
  color: #4CAF50;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    border-radius: 12px;
  }
  
  .password-strength {
    margin-top: 4px;
  }
}

/* Loading animation for username check */
.v-progress-circular {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
