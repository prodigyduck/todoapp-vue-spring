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

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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
function normalizePlatform() {
  const isMac = navigator.platform?.toUpperCase().includes('MAC') || (navigator.userAgentData && navigator.userAgentData.platform?.toUpperCase().includes('MAC'))
  return { isMac }
}
const { isMac } = normalizePlatform()

function loadCounts(list=null) {
  // compute counts from local array if present
  counts.all = todos.value.length
  counts.important = todos.value.filter(t=>t.important).length
  counts.myDay = todos.value.filter(t=>t.myDay).length
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
  if (!search.value) return todos.value.filter(t=>!t.completed)
  const q = search.value.toLowerCase()
  return todos.value.filter(t=>!t.completed && (t.title.toLowerCase().includes(q) || (t.notes||'').toLowerCase().includes(q)))
})

const completedTodos = computed(()=> todos.value.filter(t=>t.completed))

function selectList(name) {
  activeList.value = name
  loadTodos()
}

function focusTask(id){ focusedId.value = id }

function focusNew(){ newInput.value && newInput.value.focus() }

async function createTodo(){
  if (!newTitle.value.trim()) return
  const payload = { title: newTitle.value.trim() }
  try{
    const created = await todoService.create(payload)
    newTitle.value = ''
    await loadTodos()
    // focus newly created
    if (created && created.id) focusedId.value = created.id
  }catch(e){console.error(e)}
}

async function toggleCompleted(todo){
  try{
    await todoService.toggleCompleted(todo.id)
    await loadTodos()
  }catch(e){console.error(e)}
}

async function toggleImportant(todo){
  try{
    await todoService.toggleImportant(todo.id)
    await loadTodos()
  }catch(e){console.error(e)}
}

function openDetail(todo){
  detail.id = todo.id
  detail.title = todo.title
  detail.notes = todo.notes || ''
  detail.important = !!todo.important
  detail.myDay = !!todo.myDay
  detailOpen.value = true
  // wait next tick and focus
  setTimeout(()=> detailPanel.value && detailPanel.value.focus(), 50)
}

function closeDetail(){ detailOpen.value = false; detail.id = null }

async function saveDetail(){
  if (!detail.id) return
  const payload = { title: detail.title, notes: detail.notes, important: detail.important, myDay: detail.myDay }
  try{
    await todoService.update(detail.id, payload)
    await loadTodos()
    closeDetail()
  }catch(e){console.error(e)}
}

async function deleteDetail(){
  if (!detail.id) return
  try{
    await todoService.delete(detail.id)
    await loadTodos()
    closeDetail()
  }catch(e){console.error(e)}
}

async function toggleDetailImportant(){
  detail.important = !detail.important
}

async function toggleDetailMyDay(){
  detail.myDay = !detail.myDay
}

function onSearch(){ /* debounce could be added */ }

// Keyboard handling
function handleGlobalKey(e){
  const tag = (e.target && e.target.tagName) || ''
  if (['INPUT','TEXTAREA','SELECT'].includes(tag) || e.target.isContentEditable) return
  const key = e.key.toLowerCase()
  // New
  if (key === 'n' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); newInput.value && newInput.value.focus(); return }
  // Complete focused
  if (key === 'e') { e.preventDefault(); if (focusedId.value) { const t = todos.value.find(x=>x.id===focusedId.value); t && toggleCompleted(t) } return }
  // Star (S)
  if (key === 's') { e.preventDefault(); if (focusedId.value){ const t = todos.value.find(x=>x.id===focusedId.value); t && toggleImportant(t) } return }
  // My Day (D)
  if (key === 'd') { e.preventDefault(); if (focusedId.value){ const t = todos.value.find(x=>x.id===focusedId.value); t && todoService.toggleMyDay(t.id).then(loadTodos).catch(console.error) } return }
  // Delete
  if (key === 'backspace') { e.preventDefault(); if (focusedId.value){ const t = todos.value.find(x=>x.id===focusedId.value); t && todoService.delete(t.id).then(loadTodos).catch(console.error) } return }
  // Search
  if (key === '/') { e.preventDefault(); searchInput.value && searchInput.value.focus(); return }
  // Help
  if (key === '?' || (e.shiftKey && key === '/')) { e.preventDefault(); alertShortcuts(); return }
  // Enter open
  if (key === 'enter') { if (focusedId.value){ const t = todos.value.find(x=>x.id===focusedId.value); t && openDetail(t) } }
}

function alertShortcuts(){
  const msg = 'Shortcuts:\nN New | E Complete | S Star | D My Day | Enter Open | Backspace Delete | / Search'
  alert(msg)
}

onMounted(()=>{
  loadTodos()
  window.addEventListener('keydown', handleGlobalKey)
})

onBeforeUnmount(()=>{
  window.removeEventListener('keydown', handleGlobalKey)
})

// expose refs for template
const __returned__ = { todos, activeList, counts, search, newTitle, focusedId, detail, detailOpen, detailPanel, newInput, searchInput, filteredTodos, completedTodos, selectList, focusTask, focusNew, createTodo, toggleCompleted, toggleImportant, openDetail, closeDetail, saveDetail, deleteDetail, toggleDetailImportant, toggleDetailMyDay, onSearch }
for (const key in __returned__) { if (!key.startsWith('__')) Object.defineProperty(__returned__, key, { enumerable: true }) }
</script>

<style scoped>
:root{ --primary:#195ABD; --sidebar:#F4F4F4; --detail:#FAF9F8; --star:#F2C811; --myday:#D83B01 }
.todo-app{ display:grid; grid-template-columns:250px 1fr 360px; gap:12px; height:100vh; font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, Roboto, Arial; }
.left{ background:var(--sidebar); padding:12px; overflow:auto; border-right:1px solid #e8e8e8 }
.brand h1{ margin:0 0 8px 0; font-size:20px; color:var(--primary) }
.nav-list{ list-style:none; padding:0; margin:0 }
.nav-list li{ display:flex; align-items:center; gap:8px; padding:8px; cursor:pointer; border-radius:6px }
.nav-list li.active{ background:rgba(25,90,189,0.08) }
.nav-list .badge{ margin-left:auto; background:#fff; padding:2px 8px; border-radius:999px; font-size:12px; border:1px solid #ddd }
.center{ background:#fff; padding:12px; overflow:auto }
.topbar{ display:flex; gap:8px; align-items:center; margin-bottom:8px }
.search{ flex:1; padding:8px; border:1px solid #eee; border-radius:6px }
.add-area input{ width:100%; padding:10px; border:1px solid #eee; border-radius:6px }
.tasks{ margin-top:12px }
.task-item{ display:flex; align-items:center; gap:8px; padding:8px; border-radius:6px; cursor:pointer }
.task-item:hover{ background:#fafafa }
.task-item.completed .title{ text-decoration:line-through; color:#888 }
.check{ background:transparent; border:none; cursor:pointer }
.star{ background:transparent; border:none; color:var(--star); margin-left:auto; font-size:16px }
.right{ background:var(--detail); padding:12px; transform:translateX(100%); transition:transform .22s ease; box-shadow:-8px 0 24px rgba(0,0,0,0.06); overflow:auto }
.right.open{ transform:translateX(0) }
.detail-header{ display:flex; gap:8px; align-items:center }
.detail-title{ flex:1; padding:8px; border:1px solid #eee; border-radius:6px }
.detail-notes{ width:100%; min-height:200px; margin-top:8px; padding:8px; border:1px solid #eee; border-radius:6px }
.detail-footer{ display:flex; gap:8px; margin-top:8px }
.hints-bar{ position:fixed; left:0; right:0; bottom:0; height:32px; background:rgba(0,0,0,0.03); display:flex; align-items:center; padding:0 12px }
.hints{ font-size:13px; color:#333 }
@media (max-width:1000px){ .todo-app{ grid-template-columns:72px 1fr } .right{ display:none } }
</style>
