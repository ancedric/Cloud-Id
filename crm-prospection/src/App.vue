<script setup>
import { onMounted } from 'vue'
import { useProspectsStore } from './stores/prospects.store'

const store = useProspectsStore()

onMounted(() => {
  store.initialize()
})
</script>

<template>
  <div class="min-h-screen">
    <header class="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <h1 class="font-bold text-lg">CRM Prospection LinkedIn</h1>
        <nav class="flex gap-3 text-sm">
          <RouterLink class="px-3 py-1 rounded hover:bg-slate-700" to="/">Dashboard</RouterLink>
          <RouterLink class="px-3 py-1 rounded hover:bg-slate-700" to="/prospects">Prospects</RouterLink>
        </nav>
      </div>
    </header>
    <main class="max-w-7xl mx-auto p-6">
      <p v-if="store.error" class="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{{ store.error }}</p>
      <RouterView />
    </main>
  </div>
</template>
