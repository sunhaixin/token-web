import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VConsole from 'vconsole'

import App from './App.vue'
import router from './router'

console.log('--env', import.meta.env)

if (import.meta.env.DEV) {
  new VConsole()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
