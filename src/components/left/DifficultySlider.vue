<template>
  <div class="slider-panel">
    <div class="section-title">变式难度</div>
    <el-slider
      v-model="difficulty"
      :min="1"
      :max="10"
      :step="1"
      :show-stops="true"
    />
    <div class="difficulty-label">
      <span>与原题一致</span>
      <span>大幅提升</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()

const difficulty = computed({
  get: () => store.difficulty,
  set: (value) => store.setDifficulty(value)
})
</script>

<style scoped>
.slider-panel {
  margin-bottom: 14px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.difficulty-label {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 4px;
}

:deep(.el-slider__runway) {
  background-color: #E5E7EB;
}

:deep(.el-slider__bar) {
  background-color: var(--accent-color);
}

:deep(.el-slider__button) {
  border-color: var(--accent-color);
}

:deep(.el-slider__button:hover) {
  border-color: #e85a8a;
}

:deep(.el-slider__stop) {
  background-color: #E5E7EB;
}
</style>
