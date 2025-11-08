import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './router';
import vuetify from './plugins/vuetify';
import './plugins/axios';
import './plugins/echo';
createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .mount('#app');