<template>
  <div class="options-panel">
    <div class="section-title">显示选项</div>
    <div class="options-list">
      <el-checkbox v-model="showAnswer">显示答案</el-checkbox>
      <el-checkbox v-model="showAnalysis">显示解析</el-checkbox>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()

const showAnswer = computed({
  get: () => store.showAnswer,
  set: () => store.toggleShowAnswer()
})

const showAnalysis = computed({
  get: () => store.showAnalysis,
  set: () => store.toggleShowAnalysis()
})
</script>

<style scoped>
.options-panel {
  margin-bottom: 14px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.el-checkbox {
  font-size: 12px;
}
</style>
