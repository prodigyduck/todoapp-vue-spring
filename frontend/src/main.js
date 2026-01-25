import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'

// Zen Garden Theme Configuration
const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    primary: '#2196F3',
    'primary-darken-1': '#1976D2',
    secondary: '#424242',
    'secondary-lighten-1': '#616161',
    error: '#F44336',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    'surface-variant': '#F8F9FA',
    'medium-emphasis': '#757575',
  },
  variables: {
    'border-radius-root': '12px',
    'border-radius-lg': '16px',
    'border-radius-xl': '24px',
    'border-radius-pill': '24px',
    'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
    'elevation-1': '0 2px 4px rgba(0, 0, 0, 0.08)',
    'elevation-2': '0 4px 8px rgba(0, 0, 0, 0.12)',
    'elevation-3': '0 6px 12px rgba(0, 0, 0, 0.16)',
    'elevation-4': '0 8px 16px rgba(0, 0, 0, 0.20)',
    'elevation-6': '0 12px 24px rgba(0, 0, 0, 0.28)',
  }
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
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    }
  },
  defaults: {
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
    VBtn: {
      variant: 'elevated',
      density: 'comfortable',
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      bgColor: 'surface-variant',
    },
  },
})

document.body.classList.add('fonts-loading')

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')

setTimeout(() => {
  document.body.classList.remove('fonts-loading')
}, 3000)
