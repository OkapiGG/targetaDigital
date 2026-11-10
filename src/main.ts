import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router'
import Rhinacred from './themes/rhinacred'
import './assets/tailwind.css'
import './assets/styles.scss'
import 'primeicons/primeicons.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Rhinacred,
    options: {
      darkModeSelector: false,
      cssLayer: {
        name: 'primevue',
        order: 'theme, sakai, primevue, utilities',
      },
    },
  },
})

app.mount('#app')
