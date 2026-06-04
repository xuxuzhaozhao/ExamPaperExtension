<template>
  <div class="generate-panel">
    <el-button
      type="primary"
      :loading="isGenerating"
      :disabled="!canGenerate"
      class="generate-btn"
      @click="generatePaper"
    >
      {{ isGenerating ? '生成中...' : '生成变式试卷' }}
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()

const isGenerating = computed(() => store.isGenerating)
const canGenerate = computed(() => store.files.length > 0 && !store.isGenerating)

const generatePaper = async () => {
  await store.generate()
}
</script>

<style scoped>
.generate-panel {
  margin-top: 14px;
}

.generate-btn {
  width: 100%;
  height: 36px;
  font-size: 13px;
}
</style>
