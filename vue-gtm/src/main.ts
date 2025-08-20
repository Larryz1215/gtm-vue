import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createGtm, useGtm, type GtmSupport, type VueGtmUseOptions } from '@gtm-support/vue-gtm'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
  createGtm({
    id: 'GTM-TFQD5PDG',
    vueRouter: router,
    enabled: true,
    debug: true,
  }),
)
app.use(elementPlus)

app.mount('#app')
