<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  prospect: {
    type: Object,
    required: true
  }
})

function onDragStart(event) {
  event.dataTransfer.setData('text/plain', props.prospect.id)
}
</script>

<template>
  <article
    draggable="true"
    @dragstart="onDragStart"
    class="bg-white border border-slate-200 rounded-lg p-3 shadow-sm cursor-grab"
  >
    <div class="flex justify-between items-start gap-2">
      <div>
        <h4 class="font-semibold text-sm">{{ prospect.company }}</h4>
        <p class="text-xs text-slate-500">{{ prospect.contactName }} · {{ prospect.position }}</p>
      </div>
      <span class="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">{{ prospect.score }}/100</span>
    </div>
    <p class="text-xs mt-2">Dernière action: {{ prospect.lastAction }}</p>
    <RouterLink :to="`/prospect/${prospect.id}`" class="text-xs text-indigo-600 mt-2 inline-block">Voir détails</RouterLink>
  </article>
</template>
