import { defineStore } from 'pinia'
import { appendInteraction, createProspect, getStorageMode, loadProspects, updateProspect } from '../services/prospect.service'
import { computeProspectScore } from '../services/ai.service'

export const prospectStatuses = ['À contacter', 'Contacté', 'Répondu', 'Intéressé', 'Démo planifiée', 'Client', 'Refusé']

export const useProspectsStore = defineStore('prospects', {
  state: () => ({
    prospects: [],
    storageMode: getStorageMode(),
    loading: false,
    error: ''
  }),
  getters: {
    dueToday: (state) => state.prospects.filter((p) => p.nextActionDate === new Date().toISOString().slice(0, 10)),
    staleProspects: (state) => state.prospects.filter((p) => {
      const date = new Date(p.lastInteractionDate)
      return (Date.now() - date.getTime()) / 86400000 >= 5 && p.status !== 'Client' && p.status !== 'Refusé'
    }),
    withScore: (state) => state.prospects.map((p) => ({ ...p, score: computeProspectScore(p) }))
  },
  actions: {
    async initialize() {
      this.loading = true
      this.error = ''
      try {
        this.prospects = await loadProspects()
      } catch (error) {
        this.error = error.message || 'Impossible de charger les prospects.'
      } finally {
        this.loading = false
      }
    },
    async addProspect(payload) {
      try {
        const created = await createProspect(payload)
        this.prospects.unshift(created)
      } catch (error) {
        this.error = error.message || 'Erreur lors de la création du prospect.'
      }
    },
    async moveProspect(id, status) {
      const prospect = this.prospects.find((p) => p.id === id)
      if (!prospect) return

      const updates = {
        status,
        lastAction: `Statut déplacé vers ${status}`,
        lastInteractionDate: new Date().toISOString()
      }

      const updated = await updateProspect(id, updates)
      if (updated) {
        Object.assign(prospect, updated)
      }
    },
    async addInteraction(id, interaction) {
      const prospect = this.prospects.find((p) => p.id === id)
      if (!prospect) return

      const created = await appendInteraction(id, interaction)
      if (created) {
        prospect.interactions.unshift(created)
        prospect.lastInteractionDate = created.date
        prospect.lastAction = interaction.type
        if (interaction.type === 'Réponse reçue') prospect.hasReplied = true
        if (interaction.askedQuestion) prospect.questionsCount += 1

        await updateProspect(id, {
          lastInteractionDate: created.date,
          lastAction: interaction.type,
          hasReplied: prospect.hasReplied,
          questionsCount: prospect.questionsCount
        })
      }
    }
  }
})
