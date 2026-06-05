<template>
  <div class="question-item">
    <div class="question-stem">
      <span class="question-number">{{ index }}.</span>
      <span v-html="renderedStem"></span>
    </div>
    
    <div v-if="question.options" class="question-options">
      <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option-item">
        <span v-html="renderOption(option)"></span>
      </div>
    </div>
    
    <MermaidBlock v-if="question.chart?.type === 'mermaid'" :spec="question.chart.spec" />
    <EChartBlock v-else-if="question.chart?.type === 'echarts'" :spec="question.chart.spec" />
    
    <div v-if="showAnswer && question.answer" class="question-answer">
      <div class="answer-header" @click="toggleAnswer">
        <span>{{ answerExpanded ? '▼' : '▶' }}</span>
        <span>答案</span>
      </div>
      <div v-show="answerExpanded" class="answer-content">
        <span v-html="renderAnswer"></span>
      </div>
    </div>
    
    <div v-if="showAnalysis && question.analysis" class="question-analysis">
      <div class="analysis-header" @click="toggleAnalysis">
        <span>{{ analysisExpanded ? '▼' : '▶' }}</span>
        <span>解析</span>
      </div>
      <div v-show="analysisExpanded" class="analysis-content">
        <span v-html="renderedAnalysis"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { renderMarkdown } from '../../utils/markdown'
import MermaidBlock from './MermaidBlock.vue'
import EChartBlock from './EChartBlock.vue'

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true },
  showAnswer: { type: Boolean, default: true },
  showAnalysis: { type: Boolean, default: true }
})

const answerExpanded = ref(true)
const analysisExpanded = ref(true)

const renderedStem = computed(() => renderMarkdown(props.question.stem || props.question.content))
const renderedAnalysis = computed(() => renderMarkdown(props.question.analysis))
const renderAnswer = computed(() => renderMarkdown(props.question.answer))
const renderOption = (option) => renderMarkdown(option)

const toggleAnswer = () => { answerExpanded.value = !answerExpanded.value }
const toggleAnalysis = () => { analysisExpanded.value = !analysisExpanded.value }
</script>

<style scoped>
.question-item {
  padding: 12px;
  background: #FAFAFA;
  border-radius: 6px;
  margin-bottom: 10px;
}

.question-stem {
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.question-number {
  font-weight: 600;
  margin-right: 4px;
}

.question-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 10px;
}

.option-item {
  display: flex;
  font-size: 12px;
}

.option-label {
  font-weight: 500;
  margin-right: 4px;
}

.question-answer,
.question-analysis {
  margin-top: 8px;
  border-top: 1px solid #E5E7EB;
}

.answer-header,
.analysis-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-color);
}

.answer-content,
.analysis-content {
  padding-bottom: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.answer-content {
  color: #10B981;
}
</style>
