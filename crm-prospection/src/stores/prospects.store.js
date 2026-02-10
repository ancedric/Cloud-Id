import { defineStore } from 'pinia'
import { loadProspects, saveProspects } from '../services/prospect.service'
import { computeProspectScore } from '../services/ai.service'

export const prospectStatuses = ['À contacter', 'Contacté', 'Répondu', 'Intéressé', 'Démo planifiée', 'Client', 'Refusé']

export const useProspectsStore = defineStore('prospects', {
  state: () => ({
    prospects: loadProspects()
  }),
  getters: {
    sortedByStatus: (state) => (status) => state.prospects.filter((p) => p.status === status),
    dueToday: (state) => state.prospects.filter((p) => p.nextActionDate === new Date().toISOString().slice(0, 10)),
    staleProspects: (state) => state.prospects.filter((p) => {
      const date = new Date(p.lastInteractionDate)
      return (Date.now() - date.getTime()) / 86400000 >= 5 && p.status !== 'Client' && p.status !== 'Refusé'
    }),
    withScore: (state) => state.prospects.map((p) => ({ ...p, score: computeProspectScore(p) }))
  },
  actions: {
    persist() {
      saveProspects(this.prospects)
    },
    addProspect(payload) {
      this.prospects.unshift({
        id: crypto.randomUUID(),
        interactions: [],
        hasReplied: false,
        questionsCount: 0,
        averageReplyHours: 48,
        ...payload
      })
      this.persist()
    },
    moveProspect(id, status) {
      const prospect = this.prospects.find((p) => p.id === id)
      if (!prospect) return
      prospect.status = status
      prospect.lastAction = `Statut déplacé vers ${status}`
      prospect.lastInteractionDate = new Date().toISOString()
      this.persist()
    },
    addInteraction(id, interaction) {
      const prospect = this.prospects.find((p) => p.id === id)
      if (!prospect) return
      prospect.interactions.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), ...interaction })
      prospect.lastInteractionDate = new Date().toISOString()
      prospect.lastAction = interaction.type
      if (interaction.type === 'Réponse reçue') prospect.hasReplied = true
      if (interaction.askedQuestion) prospect.questionsCount += 1
      this.persist()
    }
  }
})
