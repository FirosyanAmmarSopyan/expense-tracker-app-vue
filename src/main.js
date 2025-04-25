import './assets/main.css'
import naive from 'naive-ui'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter } from './router'

const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info)
  if (err.message.includes('Failed to fetch dynamically imported module')) {
  }
}

// app.use(
//   createAuth0({
//     domain: 'dev-mtwb8b6o0ttz2gy8.us.auth0.com',
//     clientId: 'kag2hlFMvGYHJzYKiSl791xU7JidE5Il',
//     authorizationParams: {
//       redirect_uri: window.location.origin,
//       audience: 'monkey-destined-uniformly.ngrok-free.app'
//     },
//     cacheLocation: 'localstorage',
//     useRefreshTokens: true,
//     useRefreshTokensFallback: true
//   })
// )

app.use(createPinia())
app.use(createRouter(app))
app.use(naive)
app.mount('#app')
