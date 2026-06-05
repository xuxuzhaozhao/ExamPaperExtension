<template>
  <div class="paper-toolbar">
    <div class="toolbar-left">
      <input 
        v-model="fileName" 
        type="text" 
        class="file-name-input" 
        :placeholder="defaultFileName"
        @change="updateFileName"
      />
    </div>
    <div class="toolbar-right">
      <button class="toolbar-btn" @click="exportPDF">PDF</button>
      <button class="toolbar-btn" @click="printPaper">打印</button>
      <button class="toolbar-btn" @click="copyContent">复制</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { ElMessage } from 'element-plus'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()

const fileName = ref('')

const defaultFileName = ref('')

onMounted(() => {
  defaultFileName.value = store.getDefaultFileName()
})

const updateFileName = () => {
  store.setPaperFileName(fileName.value)
}

const exportPDF = async () => {
  const viewerEl = document.querySelector('.paper-viewer')
  if (!viewerEl) return
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const finalFileName = fileName.value || defaultFileName.value
  html2pdf().from(viewerEl).set({
    margin: 10,
    filename: `${finalFileName}.pdf`,
    html2canvas: { scale: 2 }
  }).save()
}

const printPaper = () => {
  const viewerEl = document.querySelector('.paper-viewer')
  if (!viewerEl) return
  
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    ElMessage.error('请允许弹出窗口以打印试卷')
    return
  }
  
  const style = `
    <style>
      @page { size: A4; margin: 15mm; }
      body { font-family: 'SimSun', serif; font-size: 14px; line-height: 1.6; }
      .paper-title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
      .paper-meta { text-align: center; font-size: 12px; color: #666; margin-bottom: 15px; }
      .section-title { font-size: 14px; font-weight: bold; margin-top: 15px; margin-bottom: 10px; }
      .question-item { margin-bottom: 15px; }
      .question-stem { margin-bottom: 10px; }
      .question-options { margin-left: 20px; }
      .option-item { margin-bottom: 5px; }
      .question-answer, .question-analysis { margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; }
    </style>
  `
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>变式试卷</title>
      ${style}
    </head>
    <body>
      ${viewerEl.innerHTML}
    </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
  }
}

const copyContent = async () => {
  const viewerEl = document.querySelector('.paper-viewer')
  if (!viewerEl) return
  
  try {
    const text = viewerEl.innerText
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
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

.toolbar-left {
  flex: 1;
  margin-right: 12px;
}

.file-name-input {
  width: 100%;
  max-width: 200px;
  padding: 4px 8px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-primary);
  background: white;
}

.file-name-input::placeholder {
  color: #9CA3AF;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-btn {
  padding: 4px 10px;
  background: var(--accent-color);
  border: 1px solid var(--accent-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: white;
}

.toolbar-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
</style>
