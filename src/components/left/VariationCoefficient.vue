<template>
  <div class="coefficient-panel">
    <div class="section-title">变式系数</div>
    <el-slider
      v-model="coefficient"
      :min="0"
      :max="6"
      :step="1"
      :show-stops="true"
    />
    <div class="coefficient-tags">
      <span v-for="(tag, index) in coefficientTags" :key="index" :class="['tag', { active: coefficient >= index }]">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()

const coefficient = computed({
  get: () => store.coefficient,
  set: (value) => store.setCoefficient(value)
})

const coefficientTags = ['紧贴', '接近', '关联', '拓展', '综合', '发散']
</script>

<style scoped>
.coefficient-panel {
  margin-bottom: 14px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.coefficient-tags {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}

.tag {
  padding: 2px 5px;
  font-size: 10px;
  background: #F3F4F6;
  color: var(--text-secondary);
  border-radius: 3px;
}

.tag.active {
  background: var(--primary-color);
  color: white;
}
</style>
