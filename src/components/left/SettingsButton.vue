<template>
  <div class="settings-panel">
    <button class="settings-btn" @click="showSettings = true">
      <span class="settings-icon">⚙️</span>
      <span>设置</span>
    </button>

    <Teleport to="body">
      <div v-if="showSettings" class="settings-modal-overlay" @click.self="closeModal">
        <div class="settings-modal">
          <div class="modal-header">
            <h3>API 设置</h3>
            <button class="close-btn" @click="closeModal">×</button>
          </div>
          <div class="modal-body">
            <div class="form-item">
              <label>API URL</label>
              <input 
                type="text" 
                v-model="localApiUrl" 
                placeholder="例如: https://api.deepseek.com/v1/chat/completions"
                class="form-input"
              />
            </div>
            <div class="form-item">
              <label>API Key</label>
              <input 
                type="password" 
                v-model="localApiKey" 
                placeholder="例如: sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                class="form-input"
              />
            </div>
            <div class="form-item">
              <label>Model</label>
              <input 
                type="text" 
                v-model="localApiModel" 
                placeholder="例如: deepseek-v4-pro"
                class="form-input"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">取消</button>
            <button class="btn-save" @click="saveSettings">保存</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePaperStore } from '../../store/paper'

const store = usePaperStore()
const showSettings = ref(false)
const localApiUrl = ref('')
const localApiKey = ref('')
const localApiModel = ref('deepseek-v4-pro')

const STORAGE_KEY = 'exam_variator_api_config'

onMounted(() => {
  // 优先从 localStorage 加载配置
  const savedConfig = localStorage.getItem(STORAGE_KEY)
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      localApiUrl.value = config.apiUrl || ''
      localApiKey.value = config.apiKey || ''
      localApiModel.value = config.apiModel || 'deepseek-v4-pro'
      // 同步到 store
      store.setApiConfig({
        apiUrl: localApiUrl.value,
        apiKey: localApiKey.value,
        apiModel: localApiModel.value,
        useCustomApi: !!config.apiUrl
      })
    } catch (e) {
      console.error('加载配置失败:', e)
    }
  }
})

const closeModal = () => {
  showSettings.value = false
}

const saveSettings = () => {
  // 保存到 localStorage
  const config = {
    apiUrl: localApiUrl.value,
    apiKey: localApiKey.value,
    apiModel: localApiModel.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  
  // 同步到 store
  store.setApiConfig({
    apiUrl: localApiUrl.value,
    apiKey: localApiKey.value,
    apiModel: localApiModel.value,
    useCustomApi: !!localApiUrl.value
  })
  
  // 关闭弹框
  showSettings.value = false
  
  // 显示保存成功提示
  showToast('配置保存成功！')
}

const showToast = (message) => {
  // 创建提示元素
  const toast = document.createElement('div')
  toast.className = 'api-config-toast'
  toast.textContent = message
  document.body.appendChild(toast)
  
  // 3秒后移除
  setTimeout(() => {
    toast.classList.add('fade-out')
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}
</script>

<style scoped>
.settings-panel {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.settings-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: #F3F4F6;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  transition: all 0.2s;
}

.settings-btn:hover {
  background: #E5E7EB;
}

.settings-icon {
  font-size: 16px;
}

.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.settings-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #F3F4F6;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #6B7280;
  line-height: 1;
}

.close-btn:hover {
  background: #E5E7EB;
}

.modal-body {
  padding: 16px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 13px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel, .btn-save {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  border: 1px solid #D1D5DB;
  background: white;
  color: #374151;
}

.btn-cancel:hover {
  background: #F9FAFB;
}

.btn-save {
  border: none;
  background: var(--primary-color);
  color: white;
}

.btn-save:hover {
  background: var(--primary-hover);
}

/* Toast 样式 */
.api-config-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10B981;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

.api-config-toast.fade-out {
  animation: fadeOut 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
