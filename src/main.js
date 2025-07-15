import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import aniTypewriter from '@/utils/directives/aniTypewriter'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('ani-typewriter', aniTypewriter)

app.mount('#app')
