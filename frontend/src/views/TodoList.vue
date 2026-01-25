<template>
  <div class="todo-container">
    <div class="background-shapes"></div>
    <v-container class="pa-4">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <!-- Header Card -->
          <v-card 
            class="mb-6 header-card" 
            elevation="6"
            rounded="xl"
            variant="elevated"
          >
            <v-card-title class="d-flex justify-space-between align-center pa-6">
              <div class="welcome-section">
                <h1 class="text-h4 font-weight-light mb-1">My Tasks</h1>
                <p class="text-subtitle-1 text-medium-emphasis">
                  Welcome back, <span class="font-weight-medium text-primary">{{ authStore.username }}</span>
                </p>
              </div>
              <v-btn 
                color="error" 
                variant="elevated" 
                @click="handleLogout"
                class="logout-btn"
                rounded="pill"
              >
                <v-icon start>mdi-logout</v-icon>
                Sign Out
              </v-btn>
            </v-card-title>
          </v-card>

          <!-- Add Todo Form -->
          <v-card 
            class="mb-6 add-todo-card" 
            elevation="4"
            rounded="lg"
            variant="elevated"
          >
            <v-card-text class="pa-6">
              <v-form @submit.prevent="handleAddTodo" class="add-todo-form">
                <v-row align="start">
                  <v-col cols="12" md="5">
                    <v-text-field
                      v-model="newTodo.title"
                      label="What needs to be done?"
                      placeholder="Enter task title"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      bg-color="surface-variant"
                      prepend-inner-icon="mdi-pencil-outline"
                      required
                      class="mb-4"
                      color="primary"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newTodo.description"
                      label="Description"
                      placeholder="Add more details (optional)"
                      variant="outlined"
                      density="comfortable"
                      rounded="lg"
                      bg-color="surface-variant"
                      prepend-inner-icon="mdi-text-outline"
                      class="mb-4"
                      color="primary"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="auto" class="d-flex align-end">
                    <v-btn
                      type="submit"
                      color="primary"
                      variant="elevated"
                      size="large"
                      class="add-btn"
                      rounded="pill"
                      elevation="2"
                    >
                      <v-icon start icon="mdi-plus" class="me-2" />
                      Add Task
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Loading State -->
          <v-card 
            v-if="loading" 
            class="mb-6 loading-card" 
            elevation="3"
            rounded="lg"
          >
            <v-card-text class="text-center py-8">
              <div class="loading-animation">
                <v-progress-circular 
                  indeterminate 
                  color="primary" 
                  size="48" 
                  width="4"
                  class="mb-4"
                />
                <p class="text-body-1 text-medium-emphasis">Loading your tasks...</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Empty State -->
          <v-card 
            v-else-if="todos.length === 0" 
            class="mb-6 empty-state-card" 
            elevation="2"
            rounded="lg"
          >
            <v-card-text class="text-center py-10">
              <div class="empty-state-animation">
                <v-icon 
                  icon="mdi-clipboard-text-outline" 
                  size="64" 
                  color="medium-emphasis"
                  class="mb-4 float-icon"
                />
                <h3 class="text-h6 font-weight-light mb-2">No tasks yet</h3>
                <p class="text-body-2 text-medium-emphasis">
                  Create your first task to get started!
                </p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Todo List -->
          <div v-else class="todo-list-container">
            <v-card 
              v-for="todo in todos" 
              :key="todo.id"
              class="mb-4 todo-item-card" 
              :elevation="2"
              rounded="lg"
              :class="{ 'completed-todo': todo.completed }"
            >
              <v-card-text class="pa-4">
                <div class="d-flex align-center">
                  <div class="checkbox-section me-4">
                    <v-checkbox
                      :model-value="todo.completed"
                      @update:model-value="handleToggleTodo(todo.id)"
                      color="primary"
                      density="comfortable"
                      hide-details
                      class="todo-checkbox"
                    />
                  </div>
                  <div class="todo-content flex-grow-1">
                    <h3 
                      class="text-h6 font-weight-regular mb-1" 
                      :class="{ 'completed-title': todo.completed }"
                    >
                      {{ todo.title }}
                    </h3>
                    <p 
                      v-if="todo.description" 
                      class="text-body-2 text-medium-emphasis mb-3"
                      :class="{ 'completed-description': todo.completed }"
                    >
                      {{ todo.description }}
                    </p>
                    <div class="todo-actions">
                      <v-btn
                        icon="mdi-delete-outline"
                        color="error"
                        variant="outlined"
                        size="small"
                        @click="handleDeleteTodo(todo.id)"
                        class="delete-btn"
                        rounded="pill"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { todoService } from '@/services/todoService'

const router = useRouter()
const authStore = useAuthStore()

const todos = ref([])
const newTodo = ref({ title: '', description: '' })
const loading = ref(false)
const error = ref('')

const loadTodos = async () => {
  loading.value = true
  error.value = ''
  try {
    todos.value = await todoService.getAll()
  } catch (err) {
    error.value = 'Failed to load todos'
  } finally {
    loading.value = false
  }
}

const handleAddTodo = async () => {
  if (!newTodo.value.title.trim()) return

  try {
    const createdTodo = await todoService.create(newTodo.value)
    todos.value.unshift(createdTodo)
    newTodo.value = { title: '', description: '' }
  } catch (err) {
    error.value = 'Failed to create todo'
  }
}

const handleToggleTodo = async (id) => {
  try {
    const updatedTodo = await todoService.toggle(id)
    const index = todos.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      todos.value[index] = updatedTodo
    }
  } catch (err) {
    error.value = 'Failed to update todo'
  }
}

const handleDeleteTodo = async (id) => {
  try {
    await todoService.delete(id)
    todos.value = todos.value.filter((t) => t.id !== id)
  } catch (err) {
    error.value = 'Failed to delete todo'
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
.todo-container {
  min-height: 100vh;
  background: #FAFAFA;
  position: relative;
  overflow-x: hidden;
}

.background-shapes {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.03;
  background-image: 
    radial-gradient(circle at 20% 30%, #2196F3 0%, transparent 2px),
    radial-gradient(circle at 80% 70%, #4CAF50 0%, transparent 2px),
    radial-gradient(circle at 40% 80%, #FF9800 0%, transparent 1px);
  background-size: 300px 300px, 200px 200px, 150px 150px;
  background-position: 10% 10%, 90% 20%, 30% 80%;
  background-repeat: no-repeat;
  animation: slow-float 30s ease-in-out infinite;
}

.header-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(33, 150, 243, 0.1);
  transition: all 0.3s ease;
}

.welcome-section h1 {
  color: #212121;
  letter-spacing: -0.5px;
}

.add-todo-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(33, 150, 243, 0.1);
}

.add-todo-form {
  animation: slide-up 0.5s ease-out;
}

.add-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.25px;
  font-weight: 500;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.25);
}

.loading-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(33, 150, 243, 0.1);
}

.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-state-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px dashed rgba(33, 150, 243, 0.2);
  transition: all 0.3s ease;
}

.empty-state-card:hover {
  border-color: rgba(33, 150, 243, 0.4);
  transform: translateY(-2px);
}

.empty-state-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.float-icon {
  animation: gentle-float 3s ease-in-out infinite;
}

.todo-list-container {
  animation: fade-in 0.6s ease-out;
}

.todo-item-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.todo-item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2196F3, #4CAF50);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.todo-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(33, 150, 243, 0.2);
}

.todo-item-card:hover::before {
  transform: scaleX(1);
}

.checkbox-section {
  display: flex;
  align-items: flex-start;
  padding-top: 8px;
}

.todo-checkbox {
  transform: scale(1.1);
}

.todo-content h3 {
  color: #212121;
  transition: all 0.3s ease;
  line-height: 1.4;
}

.completed-title {
  color: #757575;
  text-decoration: line-through;
  opacity: 0.7;
}

.todo-content p {
  line-height: 1.5;
}

.completed-description {
  color: #757575;
  opacity: 0.6;
}

.todo-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.todo-item-card:hover .todo-actions {
  opacity: 1;
}

.delete-btn {
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: rgba(244, 67, 54, 0.1);
  transform: scale(1.05);
}

.completed-todo {
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(0, 0, 0, 0.05);
}

.logout-btn {
  transition: all 0.3s ease;
  letter-spacing: 0.25px;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.25);
}

@keyframes slow-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

@keyframes gentle-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .add-todo-form .v-row {
    flex-direction: column;
  }
  
  .add-todo-form .v-col {
    width: 100% !important;
    margin-bottom: 16px;
  }
  
  .add-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .header-card,
  .add-todo-card,
  .loading-card,
  .empty-state-card,
  .todo-item-card {
    margin: 8px;
    border-radius: 12px;
  }
  
  .todo-content {
    font-size: 14px;
  }
}

:deep(.v-field__input) {
  color: #212121 !important;
}

:deep(.v-field__input::placeholder) {
  color: #757575 !important;
  opacity: 1;
}
</style>
