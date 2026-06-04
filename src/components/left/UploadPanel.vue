<template>
  <div class="upload-panel">
    <div class="section-title">上传试卷</div>
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      :multiple="true"
      :accept="acceptTypes"
      :file-list="fileList"
      :on-change="handleFileChange"
      class="uploader"
    >
      <div class="upload-area">
        <span class="upload-icon">📁</span>
        <span class="upload-text">点击或拖拽上传文件</span>
        <span class="upload-hint">支持 PDF、DOC、DOCX、图片格式</span>
      </div>
    </el-upload>
    <div v-if="files.length > 0" class="file-list">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <span class="file-name">{{ file.name }}</span>
        <button class="remove-btn" @click="removeFile(index)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()
const uploadRef = ref(null)
const fileList = ref([])
const acceptTypes = '.pdf,.doc,.docx,.png,.jpg,.jpeg'
const files = computed(() => store.files)

const handleFileChange = (file) => {
  if (!fileList.value.find(f => f.name === file.name && f.size === file.size)) {
    fileList.value.push(file)
    store.addFiles([file])
  }
}

const removeFile = (index) => {
  store.removeFile(index)
  fileList.value.splice(index, 1)
}
</script>

<style scoped>
.upload-panel {
  margin-bottom: 16px;
}

.section-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.uploader {
  width: 100%;
}

:deep(.el-upload.el-upload--text) {
  width: 100%;
}

.upload-area {
  padding: 20px 12px;
  border: 1px dashed #D1D5DB;
  border-radius: var(--border-radius);
  text-align: center;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.upload-icon {
  font-size: 28px;
}

.upload-text {
  font-size: 13px;
}

.upload-hint {
  font-size: 11px;
  color: #9CA3AF;
}

.file-list {
  margin-top: 6px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: #F9FAFB;
  border-radius: 4px;
  margin-bottom: 4px;
}

.file-name {
  font-size: 11px;
  color: var(--text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0 4px;
}

.remove-btn:hover {
  color: #EF4444;
}
</style>
