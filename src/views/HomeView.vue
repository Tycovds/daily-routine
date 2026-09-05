<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import router from '@/router/index'
import { useRoutineStore } from '@/store'
import TodayScreen from '@/components/routines/TodayScreen.vue'
import RoutinesScreen from '@/components/routines/RoutinesScreen.vue'
import SettingsScreen from '@/components/routines/SettingsScreen.vue'
import TabBar from '@/components/routines/TabBar.vue'
import CelebrationModal from '@/components/CelebrationModal.vue'
import { todaysOccurrences } from '@/utils/occurrences'

const store = useRoutineStore()

onMounted(() => {
  if (store.userName === '') {
    router.push('/login')
  }
})

const today = new Date()
type Screen = 'today' | 'routines' | 'settings'
const screen = ref<Screen>('today')
const prevScreen = ref<'today' | 'routines'>('today')

function toggleSettings() {
  if (screen.value === 'settings') {
    screen.value = prevScreen.value
  } else {
    prevScreen.value = screen.value as 'today' | 'routines'
    screen.value = 'settings'
  }
}
function selectTab(id: 'today' | 'routines') {
  screen.value = id
  prevScreen.value = id
}

const celebrated = ref(false)
const showModal = ref(false)
const occ = computed(() => todaysOccurrences(store.routines, today))
const allKeys = computed(() => [...occ.value.overdueRows, ...occ.value.todayRows])
const total = computed(() => allKeys.value.length)
const doneCount = computed(() => allKeys.value.filter((o) => store.completions[o.key]).length)

watch([doneCount, total], ([done, tot]) => {
  if (tot > 0 && done === tot) {
    if (!celebrated.value) {
      celebrated.value = true
      showModal.value = true
    }
  } else if (celebrated.value) {
    celebrated.value = false
  }
})
</script>

<template>
  <div class="relative flex h-screen flex-col bg-bg">
    <div class="flex h-12 flex-none items-center justify-end px-4">
      <button
        @click="toggleSettings"
        class="flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-[11px] border-0 transition-all"
        :class="screen === 'settings' ? 'bg-accent text-[color:var(--onAccent)]' : 'bg-transparent text-muted'"
        aria-label="Settings"
      >
        <svg v-if="screen === 'settings'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        <svg v-else width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.4M12 18.8v2.4M4.5 4.5l1.7 1.7M17.8 17.8l1.7 1.7M2.8 12h2.4M18.8 12h2.4M4.5 19.5l1.7-1.7M17.8 6.2l1.7-1.7" /></svg>
      </button>
    </div>

    <TodayScreen v-if="screen === 'today'" :today="today" />
    <RoutinesScreen v-else-if="screen === 'routines'" />
    <SettingsScreen v-else />

    <TabBar :active="screen === 'settings' ? null : screen" @select="selectTab" />

    <CelebrationModal v-if="showModal" @close="showModal = false" />
  </div>
</template>
