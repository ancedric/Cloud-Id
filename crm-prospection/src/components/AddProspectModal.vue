<script setup>
import { reactive } from 'vue'
import { prospectStatuses } from '../stores/prospects.store'

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  company: '',
  contactName: '',
  position: '',
  platform: 'LinkedIn',
  linkedinUrl: '',
  sector: '',
  companySize: 'PME',
  status: prospectStatuses[0],
  lastAction: 'Prospect ajouté',
  lastInteractionDate: new Date().toISOString(),
  nextAction: 'Premier contact',
  nextActionDate: new Date().toISOString().slice(0, 10)
})

function submit() {
  emit('submit', { ...form })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-5">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-semibold text-lg">Ajouter un prospect</h2>
        <button class="text-sm" @click="$emit('close')">Fermer</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input v-model="form.company" class="border rounded p-2 text-sm" placeholder="Entreprise" />
        <input v-model="form.contactName" class="border rounded p-2 text-sm" placeholder="Contact" />
        <input v-model="form.position" class="border rounded p-2 text-sm" placeholder="Poste" />
        <input v-model="form.platform" class="border rounded p-2 text-sm" placeholder="Plateforme" />
        <input v-model="form.linkedinUrl" class="border rounded p-2 text-sm md:col-span-2" placeholder="Lien LinkedIn" />
        <input v-model="form.sector" class="border rounded p-2 text-sm" placeholder="Secteur" />
        <select v-model="form.companySize" class="border rounded p-2 text-sm">
          <option>Startup</option><option>PME</option><option>Grande entreprise</option>
        </select>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button class="border rounded px-3 py-2 text-sm" @click="$emit('close')">Annuler</button>
        <button class="bg-slate-900 text-white rounded px-3 py-2 text-sm" @click="submit">Ajouter</button>
      </div>
    </div>
  </div>
</template>
