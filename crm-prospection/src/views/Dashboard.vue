<script setup>
import { computed } from 'vue'
import { useProspectsStore } from '../stores/prospects.store'

const store = useProspectsStore()
const total = computed(() => store.prospects.length)
const hot = computed(() => store.withScore.filter((p) => p.score >= 70).length)
</script>

<template>
  <div class="space-y-6">
    <section class="bg-white rounded-lg shadow p-4 text-sm">
      <p><strong>Mode de sauvegarde:</strong> <span class="uppercase font-semibold">{{ store.storageMode }}</span></p>
      <p v-if="store.loading" class="text-slate-500 mt-1">Chargement des prospects...</p>
      <p v-else class="text-slate-500 mt-1">Données synchronisées.</p>
    </section>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <article class="bg-white rounded-lg shadow p-4"><p class="text-sm text-slate-500">Prospects total</p><p class="text-2xl font-bold">{{ total }}</p></article>
      <article class="bg-white rounded-lg shadow p-4"><p class="text-sm text-slate-500">Prospects chauds</p><p class="text-2xl font-bold">{{ hot }}</p></article>
      <article class="bg-white rounded-lg shadow p-4"><p class="text-sm text-slate-500">À relancer (+5 jours)</p><p class="text-2xl font-bold">{{ store.staleProspects.length }}</p></article>
    </section>

    <section class="bg-white rounded-lg shadow p-4">
      <h2 class="font-semibold mb-3">À relancer aujourd'hui</h2>
      <ul v-if="store.dueToday.length" class="list-disc pl-5 text-sm space-y-1">
        <li v-for="p in store.dueToday" :key="p.id">{{ p.company }} · {{ p.contactName }} ({{ p.nextAction }})</li>
      </ul>
      <p v-else class="text-sm text-slate-500">Aucune relance planifiée aujourd'hui.</p>
    </section>
  </div>
</template>
