import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createGtm, useGtm, type GtmSupport, type VueGtmUseOptions } from '@gtm-support/vue-gtm'

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

app.mount('#app')
