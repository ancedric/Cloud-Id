<script setup>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useProspectsStore } from '../stores/prospects.store'
import AiSuggestions from '../components/AiSuggestions.vue'
import { computeProspectScore } from '../services/ai.service'

const store = useProspectsStore()
const route = useRoute()

const prospect = computed(() => {
  const found = store.prospects.find((p) => p.id === route.params.id)
  return found ? { ...found, score: computeProspectScore(found) } : null
})

const interaction = reactive({
  type: 'Message envoyé',
  content: '',
  askedQuestion: false
})

function addInteraction() {
  if (!prospect.value || !interaction.content) return
  store.addInteraction(prospect.value.id, { ...interaction })
  interaction.content = ''
  interaction.askedQuestion = false
}
</script>

<template>
  <div v-if="prospect" class="grid lg:grid-cols-3 gap-4">
    <section class="lg:col-span-2 bg-white rounded-lg shadow p-4 space-y-4">
      <header>
        <h2 class="text-xl font-semibold">{{ prospect.company }}</h2>
        <p class="text-sm text-slate-500">{{ prospect.contactName }} · {{ prospect.position }} · {{ prospect.platform }}</p>
      </header>

      <div class="text-sm grid md:grid-cols-2 gap-2">
        <p><strong>Statut:</strong> {{ prospect.status }}</p>
        <p><strong>Dernière interaction:</strong> {{ new Date(prospect.lastInteractionDate).toLocaleDateString() }}</p>
        <p><strong>Prochaine action:</strong> {{ prospect.nextAction }}</p>
        <a :href="prospect.linkedinUrl" target="_blank" class="text-indigo-600">Profil LinkedIn</a>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Historique des interactions</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="item in prospect.interactions" :key="item.id" class="border rounded p-2">
            <p class="font-medium">{{ item.type }} · {{ new Date(item.date).toLocaleString() }}</p>
            <p>{{ item.content }}</p>
          </li>
          <li v-if="!prospect.interactions.length" class="text-slate-500">Aucune interaction enregistrée.</li>
        </ul>
      </div>

      <div class="border-t pt-3 space-y-2">
        <h3 class="font-semibold">Ajouter une interaction</h3>
        <select v-model="interaction.type" class="border rounded p-2 text-sm">
          <option>Message envoyé</option>
          <option>Réponse reçue</option>
          <option>Note interne</option>
        </select>
        <textarea v-model="interaction.content" class="w-full border rounded p-2 text-sm" rows="3" placeholder="Ex: Semble intéressé mais attend validation du DG"></textarea>
        <label class="flex items-center gap-2 text-sm"><input v-model="interaction.askedQuestion" type="checkbox" /> A posé une question</label>
        <button class="bg-slate-900 text-white rounded px-3 py-2 text-sm" @click="addInteraction">Enregistrer</button>
      </div>
    </section>

    <AiSuggestions :prospect="prospect" />
  </div>
  <p v-else>Prospect introuvable.</p>
</template>
