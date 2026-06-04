<template>
  <div class="paper-toolbar">
    <div class="toolbar-left">
      <button class="toolbar-btn" @click="zoomOut">−</button>
      <span class="zoom-value">{{ zoom }}%</span>
      <button class="toolbar-btn" @click="zoomIn">+</button>
      <button class="toolbar-btn" @click="resetZoom">重置</button>
    </div>
    <div class="toolbar-right">
      <button class="toolbar-btn" @click="exportPDF">PDF</button>
      <button class="toolbar-btn" @click="printPaper">打印</button>
      <button class="toolbar-btn" @click="copyContent">复制</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import html2pdf from 'html2pdf.js'
import printJS from 'print-js'

const zoom = ref(100)

const zoomIn = () => {
  if (zoom.value < 150) {
    zoom.value += 10
    const viewer = document.querySelector('.paper-viewer')
    if (viewer) viewer.style.transform = `scale(${zoom.value / 100})`
  }
}

const zoomOut = () => {
  if (zoom.value > 50) {
    zoom.value -= 10
    const viewer = document.querySelector('.paper-viewer')
    if (viewer) viewer.style.transform = `scale(${zoom.value / 100})`
  }
}

const resetZoom = () => {
  zoom.value = 100
  const viewer = document.querySelector('.paper-viewer')
  if (viewer) viewer.style.transform = 'scale(1)'
}

const exportPDF = async () => {
  const viewerEl = document.querySelector('.paper-viewer')
  if (!viewerEl) return
  await new Promise(resolve => setTimeout(resolve, 500))
  html2pdf().from(viewerEl).set({
    margin: 10,
    filename: '变式试卷.pdf',
    html2canvas: { scale: 2 }
  }).save()
}

const printPaper = () => {
  printJS({
    printable: '.paper-viewer',
    type: 'html',
    css: `@page { size: A4; margin: 15mm; }`
  })
}

const copyContent = () => {
  const viewerEl = document.querySelector('.paper-viewer')
  if (!viewerEl) return
  navigator.clipboard.writeText(viewerEl.innerText).then(() => {
    ElMessage.success('已复制到剪贴板')
  })
}
</script>

<style scoped>
.paper-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--card-background);
  border-radius: var(--border-radius);
  margin-bottom: 10px;
  flex-shrink: 0;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-btn {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-primary);
}

.toolbar-btn:hover {
  background: #F3F4F6;
}

.zoom-value {
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 36px;
  text-align: center;
}
</style>
