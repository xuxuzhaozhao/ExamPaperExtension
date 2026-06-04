<template>
  <div class="echart-block">
    <div :ref="chartRef" class="echart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  spec: { type: Object, required: true }
})

const chartRef = ref(null)
let chartInstance = null

const renderChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.spec)
}

const handleResize = () => chartInstance?.resize()

onMounted(() => {
  renderChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(() => props.spec, () => renderChart(), { deep: true })
</script>

<style scoped>
.echart-block {
  margin: 12px 0;
}

.echart-container {
  width: 100%;
  height: 250px;
}
</style>
