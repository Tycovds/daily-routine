import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useRoutineStore } from './store'
import { applyTheme, resolveTheme } from './utils/theme'

const STORAGE_KEY = 'routine-state'

const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => {
  if (store.$id !== 'routine') return
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        userName: state.userName,
        routines: state.routines,
        completions: state.completions,
        settings: state.settings,
      }),
    )
  })
})
app.use(pinia)

const routineStore = useRoutineStore()
applyTheme(resolveTheme(routineStore.settings))
watch(
  () => routineStore.settings,
  (settings) => applyTheme(resolveTheme(settings)),
  { deep: true },
)

app.use(router).mount('#app')
