import './assets/main.css'
import { setupCalendar, Calendar } from 'v-calendar';
import 'v-calendar/style.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(setupCalendar, {})
app.component('VCalendar', Calendar)
app.mount('#app')
