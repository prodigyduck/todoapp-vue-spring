<template>
  <div class="todo-app">
    <div class="left" role="navigation" aria-label="Lists">
      <div class="brand">
        <h1>Todo</h1>
      </div>

      <ul class="nav-list">
        <li :class="{active: activeList==='myday'}" @click="selectList('myday')">
          <span class="icon">☀️</span>
          <span class="label">My Day</span>
          <span class="badge" v-if="counts.myDay">{{ counts.myDay }}</span>
        </li>
        <li :class="{active: activeList==='important'}" @click="selectList('important')">
          <span class="icon">★</span>
          <span class="label">Important</span>
          <span class="badge" v-if="counts.important">{{ counts.important }}</span>
        </li>
        <li :class="{active: activeList==='all'}" @click="selectList('all')">
          <span class="icon">📋</span>
          <span class="label">Tasks</span>
          <span class="badge" v-if="counts.all">{{ counts.all }}</span>
        </li>
      </ul>
    </div>

    <div class="center" role="main">
      <div class="topbar">
        <input ref="searchInput" class="search" placeholder="Search (press /)" v-model="search" @input="onSearch" aria-label="Search tasks" />
        <button class="add-btn" @click="focusNew">+ Add</button>
      </div>

      <div class="add-area">
        <input ref="newInput" v-model="newTitle" @keyup.enter="createTodo" placeholder="Add a task" aria-label="Add a task" />
      </div>

      <div class="tasks">
        <div v-for="todo in filteredTodos" :key="todo.id" class="task-item" :class="{completed: todo.completed, focused: focusedId===todo.id}" @click="openDetail(todo)" tabindex="0" @focus="focusTask(todo.id)">
          <button class="check" @click.stop="toggleCompleted(todo)">
            <span v-if="todo.completed">✔︎</span>
            <span v-else>○</span>
          </button>
          <div class="title">{{ todo.title }}</div>
          <button class="star" :aria-pressed="todo.important" @click.stop="toggleImportant(todo)">★</button>
        </div>

        <details class="completed-section" open>
          <summary>Completed ({{ completedTodos.length }})</summary>
          <div v-for="t in completedTodos" :key="t.id" class="task-item completed">
            <div class="title">{{ t.title }}</div>
          </div>
        </details>
      </div>
    </div>

    <aside class="right" :class="{open: detailOpen}" role="complementary" aria-hidden="!detailOpen" ref="detailPanel">
      <div class="detail-header">
        <input class="detail-title" v-model="detail.title" @keyup.enter="saveDetail" />
        <div class="detail-actions">
          <button @click="toggleDetailImportant" :title="detail.important ? 'Unstar (S)' : 'Star (S)'">★</button>
          <button @click="toggleDetailMyDay" :title="detail.myDay ? 'Remove from My Day (D)' : 'Add to My Day (D)'">☀️</button>
        </div>
      </div>
      <textarea class="detail-notes" v-model="detail.notes" placeholder="Notes"></textarea>
      <div class="detail-footer">
        <button class="save" @click="saveDetail">Save</button>
        <button class="delete" @click="deleteDetail">Delete</button>
      </div>
    </aside>

    <div class="hints-bar" role="status" aria-live="polite">
      <div class="hints">N New | E Complete | S Star | D My Day | ←/→ Navigate | Enter Open | Backspace Delete | / Search | ? Shortcuts</div>
    </div>
  </div>
</template>
                @keydown.escape="closeAddForm"
                @keydown.enter.meta.exact="handleAddTodo"
                @keydown.enter.ctrl.exact="handleAddTodo"
              />
              <input
                v-model="newTodo.description"
                class="things-edit-input things-edit-desc"
                placeholder="Notes"
                @keydown.escape="closeAddForm"
                @keydown.enter.meta.exact="handleAddTodo"
                @keydown.enter.ctrl.exact="handleAddTodo"
              />
              <div class="things-edit-actions">
                <button type="submit" class="things-btn things-btn--primary">Save</button>
                <button type="button" class="things-btn things-btn--ghost" @click="closeAddForm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Keyboard Shortcuts Help -->
      <div v-if="showShortcuts" class="things-shortcuts-overlay" @click="showShortcuts = false">
        <div class="things-shortcuts-panel" @click.stop>
          <h2 class="things-shortcuts-title">Keyboard Shortcuts</h2>
          <div class="things-shortcuts-grid">
            <div class="things-shortcut-group">
              <h3 class="things-shortcut-group-title">Tasks</h3>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>N</kbd></span>
                <span class="things-shortcut-desc">New To-Do</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>E</kbd></span>
                <span class="things-shortcut-desc">Complete / Uncomplete</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>⌫</kbd></span>
                <span class="things-shortcut-desc">Delete</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>Enter</kbd></span>
                <span class="things-shortcut-desc">Edit</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>{{ metaKey }}</kbd><kbd>Enter</kbd></span>
                <span class="things-shortcut-desc">Save &amp; Close</span>
              </div>
            </div>
            <div class="things-shortcut-group">
              <h3 class="things-shortcut-group-title">Navigation</h3>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>↑</kbd> <kbd>↓</kbd></span>
                <span class="things-shortcut-desc">Move Focus</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>Shift</kbd><kbd>↑↓</kbd></span>
                <span class="things-shortcut-desc">Extend Selection</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>{{ metaKey }}</kbd><kbd>A</kbd></span>
                <span class="things-shortcut-desc">Select All</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>Esc</kbd></span>
                <span class="things-shortcut-desc">Deselect / Cancel</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>/</kbd></span>
                <span class="things-shortcut-desc">Search</span>
              </div>
              <div class="things-shortcut-row">
                <span class="things-shortcut-keys"><kbd>?</kbd></span>
                <span class="things-shortcut-desc">Show Shortcuts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { todoService } from '@/services/todoService'

// ── Data ──
const todos = ref([])
const newTodo = ref({ title: '', description: '' })
const loading = ref(false)
const error = ref('')
const showAddForm = ref(false)
const newTodoInput = ref(null)
const appRoot = ref(null)

// ── Edit state ──
const editingId = ref(null)
const editTodo = ref({ title: '', description: '' })
const editTitleInput = ref(null)
const savingId = ref(null)
const togglingIds = ref(new Set())

// ── Selection state ──
const focusedIndex = ref(-1)
const selectedIds = ref(new Set())

// ── Search state ──
const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

// ── Shortcuts help ──
const showShortcuts = ref(false)

// ── Platform detection ──
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const metaKey = isMac ? '⌘' : 'Ctrl'

// ── Computed ──
const filteredTodos = computed(() => {
  if (!searchQuery.value.trim()) return todos.value
  const q = searchQuery.value.toLowerCase().trim()
  return todos.value.filter(
    (t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
  )
})

// ── Focus management ──
const focusApp = () => {
  nextTick(() => appRoot.value?.focus())
}

const clampFocusedIndex = () => {
  const len = filteredTodos.value.length
  if (len === 0) {
    focusedIndex.value = -1
    return
  }
  if (focusedIndex.value >= len) focusedIndex.value = len - 1
  if (focusedIndex.value < 0) focusedIndex.value = 0
}

// ── Selection helpers ──
const clearSelection = () => {
  selectedIds.value = new Set()
  focusedIndex.value = -1
}

const selectSingle = (index) => {
  focusedIndex.value = index
  const todo = filteredTodos.value[index]
  if (todo) {
    selectedIds.value = new Set([todo.id])
  }
}

const toggleSelection = (id) => {
  const next = new Set(selectedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  selectedIds.value = next
}

const extendSelection = (direction) => {
  const len = filteredTodos.value.length
  if (len === 0) return

  let newIndex = focusedIndex.value + direction
  if (newIndex < 0) newIndex = 0
  if (newIndex >= len) newIndex = len - 1

  focusedIndex.value = newIndex
  const todo = filteredTodos.value[newIndex]
  if (todo) {
    const next = new Set(selectedIds.value)
    next.add(todo.id)
    selectedIds.value = next
  }
}

const selectAll = () => {
  selectedIds.value = new Set(filteredTodos.value.map((t) => t.id))
  if (filteredTodos.value.length > 0) {
    focusedIndex.value = 0
  }
}

// ── Task actions ──
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

const openAddForm = () => {
  editingId.value = null
  showAddForm.value = true
  clearSelection()
}

const closeAddForm = () => {
  showAddForm.value = false
  newTodo.value = { title: '', description: '' }
  focusApp()
}

const handleAddTodo = async () => {
  if (!newTodo.value.title.trim()) return
  try {
    const createdTodo = await todoService.create(newTodo.value)
    todos.value.unshift(createdTodo)
    newTodo.value = { title: '', description: '' }
    showAddForm.value = false
    focusedIndex.value = 0
    selectedIds.value = new Set([createdTodo.id])
    focusApp()
  } catch (err) {
    error.value = 'Failed to create todo'
  }
}

const handleToggleTodo = async (id) => {
  const index = todos.value.findIndex((t) => t.id === id)
  if (index === -1) return

  const original = { ...todos.value[index] }
  todos.value[index].completed = !todos.value[index].completed
  togglingIds.value.add(id)

  try {
    const updatedTodo = await todoService.toggle(id)
    if (updatedTodo) {
      todos.value[index] = updatedTodo
    }
  } catch (err) {
    todos.value[index] = original
    error.value = 'Failed to update todo'
  } finally {
    togglingIds.value.delete(id)
  }
}

const handleToggleSelected = () => {
  const ids = [...selectedIds.value]
  if (ids.length === 0 && focusedIndex.value >= 0) {
    const todo = filteredTodos.value[focusedIndex.value]
    if (todo) ids.push(todo.id)
  }
  ids.forEach((id) => handleToggleTodo(id))
}

const handleDeleteTodo = async (id) => {
  try {
    await todoService.delete(id)
    todos.value = todos.value.filter((t) => t.id !== id)
    selectedIds.value.delete(id)
    clampFocusedIndex()
  } catch (err) {
    error.value = 'Failed to delete todo'
  }
}

const handleDeleteSelected = async () => {
  const ids = [...selectedIds.value]
  if (ids.length === 0 && focusedIndex.value >= 0) {
    const todo = filteredTodos.value[focusedIndex.value]
    if (todo) ids.push(todo.id)
  }
  for (const id of ids) {
    await handleDeleteTodo(id)
  }
  clampFocusedIndex()
}

// ── Edit handlers ──
const handleEditStart = (todo) => {
  showAddForm.value = false
  editingId.value = todo.id
  editTodo.value = { title: todo.title || '', description: todo.description || '' }
  nextTick(() => {
    // editTitleInput can be an array when used inside v-for with ref
    const el = Array.isArray(editTitleInput.value) ? editTitleInput.value[0] : editTitleInput.value
    el?.focus()
  })
}

const handleEditFocused = () => {
  if (focusedIndex.value < 0) return
  const todo = filteredTodos.value[focusedIndex.value]
  if (todo) handleEditStart(todo)
}

const handleEditCancel = () => {
  editingId.value = null
  editTodo.value = { title: '', description: '' }
  focusApp()
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
    focusApp()
  } catch (err) {
    error.value = 'Failed to save todo'
  } finally {
    savingId.value = null
  }
}

// ── Search ──
const openSearch = () => {
  showSearch.value = true
  nextTick(() => searchInput.value?.focus())
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
  focusApp()
}

// ── Task click handler ──
const handleTaskClick = (index, event) => {
  if (editingId.value) return

  if (event.metaKey || event.ctrlKey) {
    // ⌘/Ctrl + click → toggle selection
    const todo = filteredTodos.value[index]
    if (todo) {
      focusedIndex.value = index
      toggleSelection(todo.id)
    }
  } else if (event.shiftKey && focusedIndex.value >= 0) {
    // Shift + click → range select
    const start = Math.min(focusedIndex.value, index)
    const end = Math.max(focusedIndex.value, index)
    const next = new Set(selectedIds.value)
    for (let i = start; i <= end; i++) {
      const todo = filteredTodos.value[i]
      if (todo) next.add(todo.id)
    }
    selectedIds.value = next
    focusedIndex.value = index
  } else {
    selectSingle(index)
  }
}

// ── Global keyboard handler ──
const handleGlobalKeydown = (e) => {
  const meta = isMac ? e.metaKey : e.ctrlKey
  const key = e.key

  // Inside input/editing → don't intercept most shortcuts
  const inInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
  const inEditMode = editingId.value !== null || showAddForm.value

  // ⌘F or / — Search (always works except when typing)
  if (meta && key === 'f') {
    e.preventDefault()
    if (showSearch.value) {
      closeSearch()
    } else {
      openSearch()
    }
    return
  }

  // / — Search (single key, only when not in input)
  if (key === '/' && !meta && !inInput) {
    e.preventDefault()
    openSearch()
    return
  }

  // ? — Show shortcuts (only when not in input)
  if (key === '?' && !inInput) {
    e.preventDefault()
    showShortcuts.value = !showShortcuts.value
    return
  }

  // Skip remaining shortcuts when in input/edit mode
  if (inEditMode || inInput) return

  // N — New To-Do (single key, no modifier)
  if (key === 'n' && !meta && !e.shiftKey && !e.altKey) {
    e.preventDefault()
    openAddForm()
    return
  }

  // E — Toggle complete (single key, no modifier)
  if (key === 'e' && !meta && !e.shiftKey && !e.altKey) {
    e.preventDefault()
    handleToggleSelected()
    return
  }

  // Escape — deselect / close search / close shortcuts
  if (key === 'Escape') {
    e.preventDefault()
    if (showShortcuts.value) {
      showShortcuts.value = false
    } else if (showSearch.value) {
      closeSearch()
    } else if (selectedIds.value.size > 0 || focusedIndex.value >= 0) {
      clearSelection()
    }
    return
  }

  // ↑ / ↓ — Navigate
  if (key === 'ArrowUp' && !meta && !e.shiftKey) {
    e.preventDefault()
    if (filteredTodos.value.length === 0) return
    if (focusedIndex.value <= 0) {
      selectSingle(0)
    } else {
      selectSingle(focusedIndex.value - 1)
    }
    scrollFocusedIntoView()
    return
  }

  if (key === 'ArrowDown' && !meta && !e.shiftKey) {
    e.preventDefault()
    if (filteredTodos.value.length === 0) return
    const maxIdx = filteredTodos.value.length - 1
    if (focusedIndex.value < 0) {
      selectSingle(0)
    } else if (focusedIndex.value >= maxIdx) {
      selectSingle(maxIdx)
    } else {
      selectSingle(focusedIndex.value + 1)
    }
    scrollFocusedIntoView()
    return
  }

  // Shift + ↑/↓ — Extend selection
  if (key === 'ArrowUp' && e.shiftKey && !meta) {
    e.preventDefault()
    extendSelection(-1)
    scrollFocusedIntoView()
    return
  }

  if (key === 'ArrowDown' && e.shiftKey && !meta) {
    e.preventDefault()
    extendSelection(1)
    scrollFocusedIntoView()
    return
  }

  // ⌘A — Select all
  if (meta && key === 'a') {
    e.preventDefault()
    selectAll()
    return
  }

  // Backspace / Delete — Delete selected
  if (key === 'Backspace' || key === 'Delete') {
    e.preventDefault()
    handleDeleteSelected()
    return
  }

  // Enter — Edit focused
  if (key === 'Enter' && !meta) {
    e.preventDefault()
    handleEditFocused()
    return
  }
}

// ── Scroll focused item into view ──
const scrollFocusedIntoView = () => {
  nextTick(() => {
    const el = appRoot.value?.querySelector('.things-task--focused')
    if (el) {
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  })
}

// ── Auto-focus new todo input when form appears ──
watch(showAddForm, async (val) => {
  if (val) {
    await nextTick()
    newTodoInput.value?.focus()
  }
})

// ── Lifecycle ──
onMounted(() => {
  loadTodos()
  // Initial focus on app root for keyboard capture
  nextTick(() => appRoot.value?.focus())
})
</script>

<style scoped>
.things-app {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  outline: none;
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

/* Search Bar */
.things-search {
  margin-bottom: 16px;
}

.things-search-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
  border: 1px solid #e0e0e2;
  border-radius: 8px;
  background: #f7f7f8;
  color: #222222;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.things-search-input:focus {
  border-color: #2e80f2;
  background: #ffffff;
}

.things-search-input::placeholder {
  color: #b0b0b4;
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
  cursor: default;
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

.things-task--focused {
  background-color: #f0f4ff;
}

.things-task--focused:hover {
  background-color: #e8eeff;
}

.things-task--selected {
  background-color: #e8f0fe;
}

.things-task--selected:hover {
  background-color: #dce8fd;
}

.things-task--selected.things-task--focused {
  background-color: #dce8fd;
  box-shadow: inset 0 0 0 1.5px #2e80f2;
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

/* Keyboard Shortcuts Overlay */
.things-shortcuts-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.things-shortcuts-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  max-width: 520px;
  width: 90vw;
}

.things-shortcuts-title {
  font-size: 18px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 20px 0;
}

.things-shortcuts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.things-shortcut-group-title {
  font-size: 12px;
  font-weight: 600;
  color: #8a8a8e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 10px 0;
}

.things-shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.things-shortcut-keys {
  display: flex;
  gap: 3px;
}

.things-shortcut-keys kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  font-size: 11px;
  font-family: inherit;
  font-weight: 500;
  color: #555555;
  background: #f0f0f0;
  border: 1px solid #d8d8da;
  border-radius: 4px;
  box-shadow: 0 1px 0 #d0d0d2;
}

.things-shortcut-desc {
  font-size: 13px;
  color: #555555;
}

/* Responsive */
@media (max-width: 720px) {
  .things-content {
    padding: 32px 16px 100px;
  }

  .things-page-title {
    font-size: 22px;
  }

  .things-shortcuts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
