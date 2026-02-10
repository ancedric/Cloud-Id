<script setup>
import { suggestBestMoment, suggestFollowUp } from '../services/ai.service'

defineProps({
  prospect: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <aside class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm space-y-2">
    <h3 class="font-semibold text-indigo-800">Mini module IA</h3>
    <p><strong>Score:</strong> {{ prospect.score }}/100</p>
    <p><strong>Suggestion:</strong> {{ suggestFollowUp(prospect) }}</p>
    <p><strong>Meilleur moment:</strong> {{ suggestBestMoment(prospect) }}</p>
  </aside>
</template>
