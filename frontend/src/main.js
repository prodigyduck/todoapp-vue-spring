import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'

// Microsoft To Do-inspired Theme
const msToDoTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#195ABD',
    'primary-darken-1': '#0F4A9C',
    secondary: '#605E5C',
    'secondary-lighten-1': '#8A8886',
    error: '#D13438',
    info: '#0078D4',
    success: '#107C10',
    warning: '#FFB900',
    'surface-variant': '#F4F4F4',
    'on-surface-variant': '#242424',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'msToDoTheme',
    themes: {
      msToDoTheme,
    }
  },
  defaults: {
    VBtn: {
      variant: 'text',
      density: 'comfortable',
    },
    VList: {
      density: 'compact',
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
