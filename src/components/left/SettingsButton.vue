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
            <h3>设置</h3>
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
                placeholder="例如: deepseek-v4-flash"
                class="form-input"
              />
            </div>
            
            <!-- 主题色设置 -->
            <div class="section-divider"></div>
            <div class="form-item">
              <label>主题色设置</label>
              <div class="color-picker-container">
                <div class="color-item">
                  <label class="color-label">上面（标题栏）</label>
                  <div class="color-input-wrapper">
                    <input 
                      type="color" 
                      v-model="primaryColor" 
                      class="color-input"
                    />
                    <input 
                      type="text" 
                      v-model="primaryColor" 
                      class="color-hex-input"
                      placeholder="#00A1D6"
                    />
                  </div>
                </div>
                <div class="color-item">
                  <label class="color-label">下面（按钮等）</label>
                  <div class="color-input-wrapper">
                    <input 
                      type="color" 
                      v-model="accentColor" 
                      class="color-input"
                    />
                    <input 
                      type="text" 
                      v-model="accentColor" 
                      class="color-hex-input"
                      placeholder="#00A1D6"
                    />
                  </div>
                </div>
              </div>
              <div class="preset-colors">
                <span class="preset-label">预设配色：</span>
                <button 
                  v-for="preset in colorPresets" 
                  :key="preset.name"
                  class="preset-btn"
                  :title="preset.name"
                  @click="applyPreset(preset)"
                >
                  <span 
                    class="preset-color" 
                    :style="{ background: preset.primary }"
                  ></span>
                  <span 
                    class="preset-color" 
                    :style="{ background: preset.accent }"
                  ></span>
                </button>
              </div>
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
const localApiUrl = ref('https://api.deepseek.com/v1/chat/completions')
const localApiKey = ref('')
const localApiModel = ref('deepseek-v4-flash')

// 主题色
const primaryColor = ref('#00A1D6')
const accentColor = ref('#00A1D6')

// 预设配色
const colorPresets = [
  { name: '哔哩哔哩', primary: '#00A1D6', accent: '#FB7299' },
  { name: '微信', primary: '#07C160', accent: '#1989FA' },
  { name: '抖音', primary: '#000000', accent: '#FE2C55' },
  { name: '小红书', primary: '#FF2442', accent: '#FF6B8A' },
]

const STORAGE_KEY = 'exam_variator_api_config'
const THEME_STORAGE_KEY = 'exam_variator_theme_config'

onMounted(() => {
  // 加载 API 配置
  const savedConfig = localStorage.getItem(STORAGE_KEY)
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      localApiUrl.value = config.apiUrl || 'https://api.deepseek.com/v1/chat/completions'
      localApiKey.value = config.apiKey || ''
      localApiModel.value = config.apiModel || 'deepseek-v4-flash'
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
  
  // 加载主题色配置
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme) {
    try {
      const theme = JSON.parse(savedTheme)
      primaryColor.value = theme.primaryColor || '#00A1D6'
      accentColor.value = theme.accentColor || '#FB7299'
      applyTheme(primaryColor.value, accentColor.value)
    } catch (e) {
      console.error('加载主题配置失败:', e)
    }
  } else {
    // 应用默认主题
    applyTheme(primaryColor.value, accentColor.value)
  }
})

const closeModal = () => {
  showSettings.value = false
}

const saveSettings = () => {
  // 保存 API 配置
  const config = {
    apiUrl: localApiUrl.value,
    apiKey: localApiKey.value,
    apiModel: localApiModel.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  
  store.setApiConfig({
    apiUrl: localApiUrl.value,
    apiKey: localApiKey.value,
    apiModel: localApiModel.value,
    useCustomApi: !!localApiUrl.value
  })
  
  // 保存主题色配置
  const themeConfig = {
    primaryColor: primaryColor.value,
    accentColor: accentColor.value
  }
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeConfig))
  
  // 应用主题色
  applyTheme(primaryColor.value, accentColor.value)
  
  showSettings.value = false
  showToast('配置保存成功！')
}

const applyTheme = (primary, accent) => {
  const root = document.documentElement
  root.style.setProperty('--primary-color', primary)
  root.style.setProperty('--accent-color', accent)
}

const applyPreset = (preset) => {
  primaryColor.value = preset.primary
  accentColor.value = preset.accent
}

const showToast = (message) => {
  const toast = document.createElement('div')
  toast.className = 'api-config-toast'
  toast.textContent = message
  document.body.appendChild(toast)
  
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
  border-color: var(--accent-color);
}

/* 主题色设置样式 */
.section-divider {
  height: 1px;
  background: #E5E7EB;
  margin: 16px 0;
}

.color-picker-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-label {
  font-size: 12px;
  color: #6B7280;
  font-weight: 400;
}

.color-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-input {
  width: 40px;
  height: 36px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.color-input:hover {
  border-color: var(--accent-color);
}

.color-hex-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
  box-sizing: border-box;
}

.color-hex-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.preset-colors {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 12px;
  color: #6B7280;
}

.preset-btn {
  display: flex;
  gap: 3px;
  padding: 4px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  cursor: pointer;
  background: white;
  transition: all 0.2s;
}

.preset-btn:hover {
  border-color: var(--accent-color);
  background: #F9FAFB;
}

.preset-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
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
  background: var(--accent-color);
  color: white;
}

.btn-save:hover {
  background: #e85a8a;
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
