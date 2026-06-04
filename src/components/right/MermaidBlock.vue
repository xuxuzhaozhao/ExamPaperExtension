<template>
  <div class="mermaid-block">
    <div :id="chartId" class="mermaid-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mermaid from 'mermaid'

const props = defineProps({
  spec: { type: String, required: true }
})

const chartId = ref('mermaid-' + Math.random().toString(36).substr(2, 9))

const renderMermaid = () => {
  mermaid.render(chartId.value, props.spec, (svgCode) => {
    const el = document.getElementById(chartId.value)
    if (el) el.innerHTML = svgCode
  })
}

onMounted(() => {
  mermaid.initialize({ startOnLoad: false })
  renderMermaid()
})

watch(() => props.spec, () => renderMermaid())
</script>

<style scoped>
.mermaid-block {
  margin: 12px 0;
  text-align: center;
}
</style>
