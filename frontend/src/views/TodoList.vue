<template>
  <v-app class="todo-app">
    <!-- Left Sidebar -->
    <v-navigation-drawer
      permanent
      :width="260"
      color="grey-lighten-4"
      class="sidebar"
    >
      <div class="pa-4">
        <h1 class="text-h5 font-weight-bold text-primary">Todo</h1>
      </div>

      <v-list nav class="px-2">
        <v-list-item
          :active="activeList === 'myday'"
          @click="selectList('myday')"
          rounded="lg"
          class="mb-1"
        >
          <template v-slot:prepend>
            <v-icon color="amber-darken-2">mdi-weather-sunny</v-icon>
          </template>
          <v-list-item-title>My Day</v-list-item-title>
          <template v-slot:append v-if="counts.myDay">
            <v-chip size="x-small" color="blue-lighten-5" class="sidebar-badge">{{ counts.myDay }}</v-chip>
          </template>
        </v-list-item>

        <v-list-item
          :active="activeList === 'important'"
          @click="selectList('important')"
          rounded="lg"
          class="mb-1"
        >
          <template v-slot:prepend>
            <v-icon color="amber-darken-3">mdi-star</v-icon>
          </template>
          <v-list-item-title>Important</v-list-item-title>
          <template v-slot:append v-if="counts.important">
            <v-chip size="x-small" color="amber-lighten-5" class="sidebar-badge">{{ counts.important }}</v-chip>
          </template>
        </v-list-item>

        <v-list-item
          :active="activeList === 'all'"
          @click="selectList('all')"
          rounded="lg"
          class="mb-1"
        >
          <template v-slot:prepend>
            <v-icon color="blue-darken-2">mdi-clipboard-outline</v-icon>
          </template>
          <v-list-item-title>Tasks</v-list-item-title>
          <template v-slot:append v-if="counts.all">
            <v-chip size="x-small" color="grey-lighten-4" class="sidebar-badge">{{ counts.all }}</v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-white">
      <v-container fluid class="pa-6">
        <!-- Search & Add -->
        <v-row class="mb-4" align="center">
          <v-col cols="12" md="8">
            <v-text-field
              ref="searchInput"
              v-model="search"
              placeholder="Search tasks..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              class="search-input"
              @input="onSearch"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              color="primary"
              size="large"
              variant="outlined"
              block
              prepend-icon="mdi-plus"
              @click="focusNew"
              class="add-btn"
            >
              Add Task
            </v-btn>
          </v-col>
        </v-row>

        <!-- New Task Input -->
        <v-slide-y-transition>
          <v-text-field
            v-show="true"
            ref="newInput"
            v-model="newTitle"
            placeholder="Add a new task..."
            prepend-inner-icon="mdi-checkbox-blank-circle-outline"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4 new-input"
            @keyup.enter="createTodo"
          />
        </v-slide-y-transition>

        <!-- Task List -->
        <v-list class="py-0">
          <v-list-item
            v-for="todo in filteredTodos"
            :key="todo.id"
            :class="['task-item', { 'focused': focusedId === todo.id, 'completed': todo.completed }]"
            @click="openDetail(todo)"
            rounded="lg"
            class="mb-1"
          >
            <template v-slot:prepend>
              <v-btn
                :icon="todo.completed ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle-outline'"
                :color="todo.completed ? 'success' : 'grey'"
                variant="text"
                size="small"
                @click.stop="toggleCompleted(todo)"
              />
            </template>

            <v-list-item-title :class="{ 'text-decoration-line-through text-grey': todo.completed }">
              {{ todo.title }}
            </v-list-item-title>

            <template v-slot:append>
              <v-btn
                icon="mdi-star"
                :color="todo.important ? 'amber-darken-2' : 'grey-lighten-1'"
                variant="text"
                size="small"
                @click.stop="toggleImportant(todo)"
              />
            </template>
          </v-list-item>
        </v-list>

        <!-- Completed Section -->
        <v-expansion-panels class="mt-4" v-if="completedTodos.length > 0">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Completed ({{ completedTodos.length }})
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="t in completedTodos"
                  :key="t.id"
                  class="completed"
                >
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-checkbox-marked-circle</v-icon>
                  </template>
                  <v-list-item-title class="text-decoration-line-through text-grey">
                    {{ t.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-container>
    </v-main>

    <!-- Detail Panel -->
    <v-navigation-drawer
      location="right"
      :model-value="detailOpen"
      temporary
      :width="380"
      class="detail-panel"
    >
      <v-card flat>
        <v-card-title class="d-flex align-center pa-4">
          <v-text-field
            v-model="detail.title"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mr-2"
            @keyup.enter="saveDetail"
          />
          <v-btn icon="mdi-close" variant="text" @click="closeDetail" />
        </v-card-title>

        <v-card-text class="pa-4">
          <div class="d-flex ga-2 mb-4">
            <v-btn
              :color="detail.important ? 'amber-darken-2' : 'grey'"
              :variant="detail.important ? 'flat' : 'outlined'"
              prepend-icon="mdi-star"
              @click="toggleDetailImportant"
            >
              {{ detail.important ? 'Important' : 'Mark Important' }}
            </v-btn>
            <v-btn
              :color="detail.myDay ? 'amber-darken-3' : 'grey'"
              :variant="detail.myDay ? 'flat' : 'outlined'"
              prepend-icon="mdi-weather-sunny"
              @click="toggleDetailMyDay"
            >
              {{ detail.myDay ? 'My Day' : 'Add to My Day' }}
            </v-btn>
          </div>

          <v-textarea
            v-model="detail.notes"
            label="Notes"
            variant="outlined"
            rows="6"
            hide-details
          />
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-content-save"
            @click="saveDetail"
          >
            Save
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            prepend-icon="mdi-delete"
            @click="deleteDetail"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <!-- Hints Bar -->
    <v-footer app class="hints-bar" height="40">
      <div class="d-flex align-center ga-4 text-caption text-grey-darken-1">
        <span><kbd>N</kbd> New</span>
        <span><kbd>E</kbd> Complete</span>
        <span><kbd>S</kbd> Star</span>
        <span><kbd>D</kbd> My Day</span>
        <span><kbd>⌫</kbd> Delete</span>
        <span><kbd>/</kbd> Search</span>
        <span><kbd>Esc</kbd> Unfocus</span>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { todoService } from '@/services/todoService'

// State
const todos = ref([])
const activeList = ref('all')
const counts = reactive({ myDay: 0, important: 0, all: 0 })
const search = ref('')
const newTitle = ref('')
const focusedId = ref(null)

const detail = reactive({ id: null, title: '', notes: '', important: false, myDay: false })
const detailOpen = ref(false)

const detailPanel = ref(null)
const newInput = ref(null)
const searchInput = ref(null)

// Helpers
function loadCounts() {
  counts.all = todos.value.length
  counts.important = todos.value.filter(t => t.important).length
  counts.myDay = todos.value.filter(t => t.myDay).length
}

async function loadTodos() {
  try {
    let res
    if (activeList.value === 'myday') res = await todoService.getMyDay()
    else if (activeList.value === 'important') res = await todoService.getImportant()
    else res = await todoService.getTodos()
    todos.value = res || []
    loadCounts()
  } catch (e) {
    console.error('loadTodos', e)
  }
}

const filteredTodos = computed(() => {
  if (!search.value) return todos.value.filter(t => !t.completed)
  const q = search.value.toLowerCase()
  return todos.value.filter(t => !t.completed && (t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q)))
})

const completedTodos = computed(() => todos.value.filter(t => t.completed))

function selectList(name) {
  activeList.value = name
  loadTodos()
}

function focusTask(id) { focusedId.value = id }

function focusNew() { newInput.value && newInput.value.focus() }

async function createTodo() {
  if (!newTitle.value.trim()) return
  const payload = { title: newTitle.value.trim() }
  try {
    const created = await todoService.create(payload)
    newTitle.value = ''
    await loadTodos()
    if (created && created.id) focusedId.value = created.id
  } catch (e) { console.error(e) }
}

async function toggleCompleted(todo) {
  try {
    await todoService.toggleCompleted(todo.id)
    await loadTodos()
  } catch (e) { console.error(e) }
}

async function toggleImportant(todo) {
  try {
    await todoService.toggleImportant(todo.id)
    await loadTodos()
  } catch (e) { console.error(e) }
}

function openDetail(todo) {
  detail.id = todo.id
  detail.title = todo.title
  detail.notes = todo.notes || ''
  detail.important = !!todo.important
  detail.myDay = !!todo.myDay
  detailOpen.value = true
}

function closeDetail() {
  detailOpen.value = false
  detail.id = null
}

async function saveDetail() {
  if (!detail.id) return
  const payload = { title: detail.title, notes: detail.notes, important: detail.important, myDay: detail.myDay }
  try {
    await todoService.update(detail.id, payload)
    await loadTodos()
    closeDetail()
  } catch (e) { console.error(e) }
}

async function deleteDetail() {
  if (!detail.id) return
  try {
    await todoService.delete(detail.id)
    await loadTodos()
    closeDetail()
  } catch (e) { console.error(e) }
}

async function toggleDetailImportant() {
  detail.important = !detail.important
}

async function toggleDetailMyDay() {
  detail.myDay = !detail.myDay
}

function onSearch() { /* debounce could be added */ }

// Keyboard handling
function handleGlobalKey(e) {
  const tag = (e.target && e.target.tagName) || ''
  const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || e.target.isContentEditable

  // ESC to blur/unfocus from input
  if (e.key === 'Escape') {
    if (isInput) {
      e.target.blur()
      return
    }
    // Close detail panel on ESC
    if (detailOpen.value) {
      closeDetail()
      return
    }
  }

  if (isInput) return
  const key = e.key.toLowerCase()

  if (key === 'n' && !e.ctrlKey && !e.metaKey) {
    e.preventDefault()
    newInput.value && newInput.value.focus()
    return
  }
  if (key === 'e') {
    e.preventDefault()
    if (focusedId.value) {
      const t = todos.value.find(x => x.id === focusedId.value)
      t && toggleCompleted(t)
    }
    return
  }
  if (key === 's') {
    e.preventDefault()
    if (focusedId.value) {
      const t = todos.value.find(x => x.id === focusedId.value)
      t && toggleImportant(t)
    }
    return
  }
  if (key === 'd') {
    e.preventDefault()
    if (focusedId.value) {
      const t = todos.value.find(x => x.id === focusedId.value)
      t && todoService.toggleMyDay(t.id).then(loadTodos).catch(console.error)
    }
    return
  }
  if (key === 'backspace') {
    e.preventDefault()
    if (focusedId.value) {
      const t = todos.value.find(x => x.id === focusedId.value)
      t && todoService.delete(t.id).then(loadTodos).catch(console.error)
    }
    return
  }
  if (key === '/') {
    e.preventDefault()
    searchInput.value && searchInput.value.focus()
    return
  }
  if (key === 'enter') {
    if (focusedId.value) {
      const t = todos.value.find(x => x.id === focusedId.value)
      t && openDetail(t)
    }
  }
}

onMounted(() => {
  loadTodos()
  window.addEventListener('keydown', handleGlobalKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKey)
})
</script>

<style scoped>
.todo-app {
  min-height: 100vh;
}

.sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.add-btn {
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: none;
  border-radius: 8px;
  color: #1976D2;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background-color: rgba(25, 118, 210, 0.08);
  color: #115293;
}

.task-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
  border-radius: 8px;
}

.task-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
  box-shadow: 0 2px 8px rgba(25, 90, 189, 0.08);
  transform: translateY(-1px);
}

.task-item.focused {
  background-color: rgba(25, 90, 189, 0.08);
  border-color: rgba(25, 90, 189, 0.3);
  box-shadow: 0 4px 16px rgba(25, 90, 189, 0.15);
}

.detail-panel {
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.08);
}

.hints-bar {
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 8px 20px;
}

.hints-bar kbd {
  display: inline-block;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace;
  line-height: 1.2;
  color: #fff;
  background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
  border-radius: 4px;
  margin-right: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.v-list-item--active {
  background-color: rgba(25, 90, 189, 0.08) !important;
}

:deep(.v-btn--size-large) {
  font-size: 15px;
}

:deep(.v-text-field .v-field__outline) {
  --v-field-border-opacity: 0.2;
}

:deep(.v-text-field:hover .v-field__outline) {
  --v-field-border-opacity: 0.4;
}

/* Input elevation styles */
.search-input,
.new-input {
  transition: all 0.2s ease;
}

:deep(.search-input.v-text-field--focused .v-field),
:deep(.new-input.v-text-field--focused .v-field) {
  box-shadow: 0 4px 12px rgba(25, 90, 189, 0.15);
  border-radius: 8px;
}

:deep(.search-input:hover .v-field),
:deep(.new-input:hover .v-field) {
  box-shadow: 0 2px 6px rgba(25, 90, 189, 0.08);
}

/* Sidebar badge improvements */
.sidebar-badge {
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
