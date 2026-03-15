import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'

// Things 3-inspired Theme
const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#2e80f2',
    'primary-darken-1': '#1a6cdf',
    secondary: '#5c6470',
    'secondary-lighten-1': '#8a8a8e',
    error: '#FF3B30',
    info: '#2e80f2',
    success: '#4cbe5e',
    warning: '#f1ca00',
    'surface-variant': '#f6f7f8',
    'medium-emphasis': '#8a8a8e',
  },
  variables: {
    'border-radius-root': '6px',
    'border-radius-lg': '8px',
    'border-radius-xl': '10px',
    'border-radius-pill': '20px',
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
    VBtn: {
      variant: 'text',
      density: 'comfortable',
      rounded: 'lg',
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
