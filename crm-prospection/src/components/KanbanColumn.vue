<script setup>
import ProspectCard from './ProspectCard.vue'

const props = defineProps({
  title: String,
  prospects: Array
})

const emit = defineEmits(['drop'])

function onDrop(event) {
  const id = event.dataTransfer.getData('text/plain')
  emit('drop', { id, status: props.title })
}
</script>

<template>
  <section
    class="bg-slate-100 rounded-lg p-3 min-h-80"
    @dragover.prevent
    @drop="onDrop"
  >
    <h3 class="font-semibold mb-3">{{ title }} ({{ prospects.length }})</h3>
    <div class="space-y-2">
      <ProspectCard v-for="p in prospects" :key="p.id" :prospect="p" />
    </div>
  </section>
</template>
