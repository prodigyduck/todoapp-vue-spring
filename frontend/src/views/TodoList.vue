<template>
  <div class="things-app">
    <div class="things-content">
      <!-- Page Title -->
      <h1 class="things-page-title">Inbox</h1>

      <!-- Task List -->
      <div v-if="loading" class="things-empty">
        <v-progress-circular indeterminate color="#2e80f2" size="24" width="2" />
      </div>

      <div v-else class="things-list">
        <!-- Task Items -->
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="things-task"
          :class="{ 'things-task--completed': todo.completed, 'things-task--editing': editingId === todo.id }"
        >
          <!-- Checkbox -->
          <div
            class="things-checkbox"
            :class="{ 'things-checkbox--checked': todo.completed, 'things-checkbox--toggling': togglingIds.has && togglingIds.has(todo.id) }"
            @click="handleToggleTodo(todo.id)"
          >
            <svg v-if="todo.completed" viewBox="0 0 14 14" class="things-checkmark">
              <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </svg>
          </div>

          <!-- Content -->
          <div class="things-task-content">
            <template v-if="editingId === todo.id">
              <input
                v-model="editTodo.title"
                class="things-edit-input things-edit-title"
                placeholder="Title"
                @keydown.enter="handleEditSave(todo.id)"
                @keydown.escape="handleEditCancel"
              />
              <input
                v-model="editTodo.description"
                class="things-edit-input things-edit-desc"
                placeholder="Notes"
                @keydown.enter="handleEditSave(todo.id)"
                @keydown.escape="handleEditCancel"
              />
              <div class="things-edit-actions">
                <button
                  class="things-btn things-btn--primary"
                  :disabled="savingId === todo.id"
                  @click="handleEditSave(todo.id)"
                >
                  {{ savingId === todo.id ? 'Saving...' : 'Save' }}
                </button>
                <button class="things-btn things-btn--ghost" @click="handleEditCancel">
                  Cancel
                </button>
              </div>
            </template>
            <template v-else>
              <span class="things-task-title">{{ todo.title }}</span>
              <span v-if="todo.description" class="things-task-notes">{{ todo.description }}</span>
            </template>
          </div>

          <!-- Hover Actions -->
          <div v-if="editingId !== todo.id" class="things-task-actions">
            <button class="things-action-btn" title="Edit" @click="handleEditStart(todo)">
              <v-icon size="16">mdi-pencil-outline</v-icon>
            </button>
            <button class="things-action-btn things-action-btn--delete" title="Delete" @click="handleDeleteTodo(todo.id)">
              <v-icon size="16">mdi-delete-outline</v-icon>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && todos.length === 0" class="things-empty">
          <span class="things-empty-text">No To-Dos</span>
        </div>

        <!-- New To-Do Button -->
        <div class="things-new-todo" @click="showAddForm = !showAddForm" v-if="!showAddForm">
          <v-icon size="18" color="#2e80f2" class="things-new-todo-icon">mdi-plus</v-icon>
          <span class="things-new-todo-text">New To-Do</span>
        </div>

        <!-- Inline Add Form -->
        <div v-if="showAddForm" class="things-add-form">
          <div class="things-checkbox things-checkbox--placeholder"></div>
          <div class="things-add-form-content">
            <form @submit.prevent="handleAddTodo">
              <input
                v-model="newTodo.title"
                class="things-edit-input things-edit-title"
                placeholder="New To-Do"
                ref="newTodoInput"
                @keydown.escape="showAddForm = false"
              />
              <input
                v-model="newTodo.description"
                class="things-edit-input things-edit-desc"
                placeholder="Notes"
                @keydown.escape="showAddForm = false"
              />
              <div class="things-edit-actions">
                <button type="submit" class="things-btn things-btn--primary">Save</button>
                <button type="button" class="things-btn things-btn--ghost" @click="showAddForm = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { todoService } from '@/services/todoService'

const todos = ref([])
const newTodo = ref({ title: '', description: '' })
const loading = ref(false)
const error = ref('')
const showAddForm = ref(false)
const newTodoInput = ref(null)

// Edit state
const editingId = ref(null)
const editTodo = ref({ title: '', description: '' })
// Track loading states
const savingId = ref(null)
const togglingIds = ref(new Set())

// Auto-focus new todo input when form appears
watch(showAddForm, async (val) => {
  if (val) {
    await nextTick()
    newTodoInput.value?.focus()
  }
})

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
    showAddForm.value = false
  } catch (err) {
    error.value = 'Failed to create todo'
  }
}

const handleToggleTodo = async (id) => {
  // Optimistic toggle: flip locally first
  const index = todos.value.findIndex((t) => t.id === id)
  if (index === -1) return

  const original = { ...todos.value[index] }
  todos.value[index].completed = !todos.value[index].completed
  togglingIds.value.add(id)

  try {
    const updatedTodo = await todoService.toggle(id)
    // Sync with server response when available
    if (updatedTodo) {
      todos.value[index] = updatedTodo
    }
  } catch (err) {
    // revert on failure
    todos.value[index] = original
    error.value = 'Failed to update todo'
  } finally {
    togglingIds.value.delete(id)
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

// Edit handlers
const handleEditStart = (todo) => {
  editingId.value = todo.id
  editTodo.value = { title: todo.title || '', description: todo.description || '' }
}

const handleEditCancel = () => {
  editingId.value = null
  editTodo.value = { title: '', description: '' }
}

const handleEditSave = async (id) => {
  if (!editTodo.value.title.trim()) return
  savingId.value = id
  try {
    const updated = await todoService.update(id, editTodo.value)
    const index = todos.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      todos.value[index] = updated
    }
    editingId.value = null
    editTodo.value = { title: '', description: '' }
  } catch (err) {
    error.value = 'Failed to save todo'
  } finally {
    savingId.value = null
  }
}

onMounted(() => {
  loadTodos()
})
</script>

<style scoped>
.things-app {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.things-content {
  width: 100%;
  max-width: 680px;
  padding: 60px 24px 120px;
}

/* Page Title */
.things-page-title {
  font-size: 26px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 24px 0;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

/* Task List */
.things-list {
  position: relative;
}

/* Task Item */
.things-task {
  display: flex;
  align-items: flex-start;
  padding: 10px 8px 10px 0;
  border-bottom: 1px solid #ebedf0;
  position: relative;
  transition: background-color 0.15s ease;
  border-radius: 6px;
  margin: 0 -8px;
  padding-left: 8px;
  padding-right: 8px;
}

.things-task:first-child {
  border-top: 1px solid #ebedf0;
}

.things-task:hover {
  background-color: #f7f7f8;
}

.things-task--completed {
  opacity: 0.55;
}

.things-task--editing {
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border-color: transparent;
  padding: 14px 16px;
  margin: 4px -8px;
  z-index: 1;
}

/* Checkbox */
.things-checkbox {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 1.8px solid #c8cacd;
  border-radius: 50%;
  margin-top: 1px;
  margin-right: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  flex-shrink: 0;
}

.things-checkbox:hover {
  border-color: #2e80f2;
}

.things-checkbox--checked {
  border-color: #c8cacd;
  background-color: #f0f0f0;
}

.things-checkbox--checked .things-checkmark {
  color: #a0a5ab;
}

.things-checkbox--toggling {
  opacity: 0.5;
}

.things-checkbox--placeholder {
  border-color: #e0e0e2;
  cursor: default;
}

.things-checkmark {
  width: 12px;
  height: 12px;
}

/* Task Content */
.things-task-content {
  flex: 1;
  min-width: 0;
  padding-top: 1px;
}

.things-task-title {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
}

.things-task--completed .things-task-title {
  color: #c8cacd;
  text-decoration: line-through;
}

.things-task-notes {
  display: block;
  font-size: 13px;
  color: #8a8a8e;
  line-height: 1.4;
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.things-task--completed .things-task-notes {
  color: #d0d0d3;
  text-decoration: line-through;
}

/* Hover Actions */
.things-task-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
  margin-left: 8px;
  flex-shrink: 0;
  padding-top: 1px;
}

.things-task:hover .things-task-actions {
  opacity: 1;
}

.things-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #b0b0b4;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
  padding: 0;
}

.things-action-btn:hover {
  color: #666666;
  background-color: #ebedf0;
}

.things-action-btn--delete:hover {
  color: #ff3b30;
  background-color: rgba(255, 59, 48, 0.08);
}

/* Edit Mode Inputs */
.things-edit-input {
  display: block;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  line-height: 1.5;
  padding: 0;
  margin: 0;
}

.things-edit-title {
  font-size: 14px;
  font-weight: 500;
  color: #222222;
}

.things-edit-title::placeholder {
  color: #c8cacd;
  font-weight: 400;
}

.things-edit-desc {
  font-size: 13px;
  color: #5c6470;
  margin-top: 4px;
}

.things-edit-desc::placeholder {
  color: #c8cacd;
}

.things-edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

/* Buttons */
.things-btn {
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 5px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.4;
}

.things-btn--primary {
  background-color: #2e80f2;
  color: #ffffff;
}

.things-btn--primary:hover {
  background-color: #1a6cdf;
}

.things-btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.things-btn--ghost {
  background: transparent;
  color: #8a8a8e;
}

.things-btn--ghost:hover {
  background-color: #f0f0f0;
  color: #555555;
}

/* New To-Do Button */
.things-new-todo {
  display: flex;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  transition: opacity 0.15s ease;
  user-select: none;
}

.things-new-todo:hover {
  opacity: 0.7;
}

.things-new-todo-icon {
  margin-right: 8px;
}

.things-new-todo-text {
  font-size: 14px;
  font-weight: 400;
  color: #2e80f2;
}

/* Inline Add Form */
.things-add-form {
  display: flex;
  align-items: flex-start;
  padding: 14px 16px;
  margin: 4px -8px;
  background: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: relative;
  z-index: 1;
}

.things-add-form-content {
  flex: 1;
  min-width: 0;
}

/* Empty State */
.things-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.things-empty-text {
  font-size: 15px;
  color: #b0b0b4;
  font-weight: 400;
}

/* Responsive */
@media (max-width: 720px) {
  .things-content {
    padding: 32px 16px 100px;
  }

  .things-page-title {
    font-size: 22px;
  }
}
</style>
