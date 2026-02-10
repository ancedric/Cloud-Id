<script setup>
import { ref } from 'vue'
import KanbanColumn from '../components/KanbanColumn.vue'
import AddProspectModal from '../components/AddProspectModal.vue'
import { prospectStatuses, useProspectsStore } from '../stores/prospects.store'

const store = useProspectsStore()
const showModal = ref(false)

function addProspect(payload) {
  store.addProspect(payload)
  showModal.value = false
}

function move({ id, status }) {
  store.moveProspect(id, status)
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Pipeline des prospects</h2>
      <button class="bg-slate-900 text-white rounded px-3 py-2 text-sm" @click="showModal = true">+ Ajouter</button>
    </div>

    <div class="grid gap-3 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
      <KanbanColumn
        v-for="status in prospectStatuses.slice(0, 5)"
        :key="status"
        :title="status"
        :prospects="store.withScore.filter((p) => p.status === status)"
        @drop="move"
      />
    </div>

    <AddProspectModal v-if="showModal" @close="showModal = false" @submit="addProspect" />
  </section>
</template>
