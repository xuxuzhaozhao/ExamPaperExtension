<template>
  <div class="paper-viewer" ref="viewerRef">
    <!-- 错误状态 -->
    <div v-if="error" class="error-state">
      <div class="error-icon">⚠</div>
      <div class="error-title">生成失败</div>
      <div class="error-message">{{ error }}</div>
      <button class="error-btn" @click="clearError">知道了</button>
    </div>
    
    <!-- 流式输出内容 -->
    <div v-else-if="streamContent" class="stream-content">
      <div class="stream-header">
        <span class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span class="stream-label">正在生成试卷...</span>
      </div>
      <pre class="stream-text">{{ streamContent }}</pre>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!paper" class="empty-state">
      <p>请上传试卷文件并点击"生成变式试卷"</p>
    </div>
    
    <!-- 试卷内容 -->
    <div v-else-if="paper && paper.questions && paper.questions.length > 0" class="paper-content">
      <div class="paper-header">
        <h1 class="paper-title">{{ paper.title || '变式试卷' }}</h1>
        <div class="paper-meta">
          <span v-if="paper.meta?.difficulty">难度：{{ paper.meta.difficulty }}</span>
          <span v-if="paper.meta?.coefficient">系数：{{ paper.meta.coefficient }}</span>
          <span>{{ paper.meta?.createdAt || new Date().toLocaleDateString() }}</span>
        </div>
      </div>
      
      <!-- 处理 API 返回的扁平结构 -->
      <div v-if="paper.questions" class="section">
        <h2 class="section-title">题目列表</h2>
        <QuestionItem
          v-for="(question, index) in paper.questions"
          :key="question.id || index"
          :question="question"
          :index="index + 1"
          :show-answer="showAnswer"
          :show-analysis="showAnalysis"
        />
      </div>
      
      <!-- 处理旧的 sections 结构（兼容旧数据） -->
      <div v-for="section in paper.sections" :key="section.name" class="section">
        <h2 class="section-title">{{ section.name }}</h2>
        <QuestionItem
          v-for="(question, index) in section.questions"
          :key="question.id || index"
          :question="question"
          :index="index + 1"
          :show-answer="showAnswer"
          :show-analysis="showAnalysis"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePaperStore } from '../../store/paper'
import QuestionItem from './QuestionItem.vue'

const store = usePaperStore()

const paper = computed(() => store.paper)
const showAnswer = computed(() => store.showAnswer)
const showAnalysis = computed(() => store.showAnalysis)
const streamContent = computed(() => store.streamContent)
const error = computed(() => store.error)
const clearError = () => store.clearError()
</script>

<style scoped>
.paper-viewer {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.error-title {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 8px;
}

.error-message {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
  max-width: 400px;
  word-break: break-all;
}

.error-btn {
  padding: 8px 24px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.error-btn:hover {
  background: #b91d1d;
}

.stream-content {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.stream-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: var(--text-secondary);
  font-size: 13px;
}

.loading-dots {
  display: flex;
  gap: 3px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: #6b7280;
  border-radius: 50%;
  animation: loading-dot 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading-dot {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.stream-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
}

.paper-content {
  max-width: 800px;
  margin: 0 auto;
}

.paper-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E5E7EB;
}

.paper-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
}

.paper-meta {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 11px;
  color: var(--text-secondary);
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
