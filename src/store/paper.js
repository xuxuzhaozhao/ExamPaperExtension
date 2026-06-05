import { defineStore } from 'pinia'
import { ref } from 'vue'

// 从 localStorage 读取保存的设置
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('paper-settings')
    if (saved) {
      const settings = JSON.parse(saved)
      return {
        difficulty: settings.difficulty ?? 6,
        coefficient: settings.coefficient ?? 1,
        showAnswer: settings.showAnswer ?? true,
        showAnalysis: settings.showAnalysis ?? true
      }
    }
  } catch (e) {
    console.warn('读取 localStorage 失败:', e)
  }
  return {
    difficulty: 6,
    coefficient: 1,
    showAnswer: true,
    showAnalysis: true
  }
}

// 保存设置到 localStorage
const saveSettings = (settings) => {
  try {
    localStorage.setItem('paper-settings', JSON.stringify(settings))
  } catch (e) {
    console.warn('保存 localStorage 失败:', e)
  }
}

export const usePaperStore = defineStore('paper', () => {
  const savedSettings = loadSettings()
  
  const files = ref([])
  const difficulty = ref(savedSettings.difficulty)
  const coefficient = ref(savedSettings.coefficient)
  const showAnswer = ref(savedSettings.showAnswer)
  const showAnalysis = ref(savedSettings.showAnalysis)
  const paper = ref(null)
  const isGenerating = ref(false)
  
  // 错误信息
  const error = ref(null)
  
  // API 配置
  const apiUrl = ref('https://api.deepseek.com/v1/chat/completions')
  const apiKey = ref('')
  const apiModel = ref('deepseek-v4-flash')
  const useCustomApi = ref(false)
  
  // 流式输出内容
  const streamContent = ref('')
  
  // 文档名称
  const paperFileName = ref('')

  const addFiles = (newFiles) => {
    files.value = [...files.value, ...newFiles]
  }

  const removeFile = (index) => {
    files.value.splice(index, 1)
  }

  const clearFiles = () => {
    files.value = []
  }

  const setDifficulty = (value) => {
    difficulty.value = value
    saveSettings({
      difficulty: difficulty.value,
      coefficient: coefficient.value,
      showAnswer: showAnswer.value,
      showAnalysis: showAnalysis.value
    })
  }

  const setCoefficient = (value) => {
    coefficient.value = value
    saveSettings({
      difficulty: difficulty.value,
      coefficient: coefficient.value,
      showAnswer: showAnswer.value,
      showAnalysis: showAnalysis.value
    })
  }

  const toggleShowAnswer = () => {
    showAnswer.value = !showAnswer.value
    saveSettings({
      difficulty: difficulty.value,
      coefficient: coefficient.value,
      showAnswer: showAnswer.value,
      showAnalysis: showAnalysis.value
    })
  }

  const toggleShowAnalysis = () => {
    showAnalysis.value = !showAnalysis.value
    saveSettings({
      difficulty: difficulty.value,
      coefficient: coefficient.value,
      showAnswer: showAnswer.value,
      showAnalysis: showAnalysis.value
    })
  }

  const setPaperFileName = (name) => {
    paperFileName.value = name
  }

  const getDefaultFileName = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `试卷${year}${month}${day}`
  }

  const setApiConfig = (config) => {
    apiUrl.value = config.apiUrl || 'https://api.deepseek.com/v1/chat/completions'
    apiKey.value = config.apiKey || ''
    apiModel.value = config.apiModel || 'deepseek-v4-flash'
    useCustomApi.value = config.useCustomApi || false
  }

  const generate = async () => {
    isGenerating.value = true
    error.value = null
    paper.value = null
    streamContent.value = ''
    try {
      if (!apiUrl.value) {
        error.value = '请先在设置中配置 API URL'
        return
      }
      if (!apiKey.value) {
        error.value = '请先在设置中配置 API Key'
        return
      }
      // 使用自定义 API 生成试卷
      console.log('正在调用 API:', apiUrl.value)
      paper.value = await generatePaperFromApi()
    } catch (err) {
      error.value = err.message || '生成试卷失败'
      paper.value = null
    } finally {
      isGenerating.value = false
      streamContent.value = ''
    }
  }

  const generatePaperFromApi = async () => {
    try {
      console.log('开始生成试卷 - API配置:', {
        apiUrl: apiUrl.value,
        apiKey: apiKey.value ? '已设置' : '未设置',
        apiModel: apiModel.value,
        filesCount: files.value.length,
        difficulty: difficulty.value,
        coefficient: coefficient.value
      })
      
      // 读取上传文件的内容
      const fileContents = await Promise.all(files.value.map(file => readFileContent(file)))
      console.log('文件内容读取完成:', fileContents.length)
      
      // 构建试卷生成的提示词
      const fileInfo = fileContents.map((content, index) => {
        return `文件 ${index + 1}: ${files.value[index].name}\n内容:\n${content.slice(0, 2000)}`
      }).join('\n\n')
      
      const systemPrompt = `你是一个专业的试卷变式生成器。请根据用户提供的参考文档，按照以下要求生成一份新的试卷：

难度系数：${difficulty.value}/10（1=最简单，10=最难）
变式系数：${coefficient.value}/6（0=不变，6=高度变化）

## 核心要求：
1. 仔细分析参考文档中的题目数量和题型结构
2. 生成的变式试卷必须与原试卷题目数量完全一致，保持一一对应关系
3. 每一道新题目都必须对应原试卷中的一道题目进行变式
4. 保持原试卷的题型结构和知识点覆盖
5. 根据难度系数调整题目难度
6. 根据变式系数调整题目的变化程度（数字、条件、选项等）

## 题目质量检查：
7. **完整性检查**：
   - 选择题必须有明确的题干和完整的选项（至少2个选项）
   - 填空题必须有明确的空格位置和合理的答案
   - 判断题必须有明确的陈述内容
   - 答案必须与题目匹配，解析必须逻辑清晰、准确无误
   
8. **科学性检查**：
   - 题目内容必须符合学科知识，不能出现错误的概念或公式
   - 数字和条件必须合理，不能出现矛盾或不可能的情况
   - 选项之间必须有明显区分度，不能出现重复或等价的选项
   - 答案必须唯一且正确，不能出现多个正确答案或无正确答案的情况

## 输出格式：
9. 输出格式为 JSON，包含 questions 数组，每个题目包含：
   - type: 题型（选择题、填空题、判断题、简答题等）
   - content: 题目内容
   - options: 选项（选择题）
   - answer: 答案
   - analysis: 解析

输出格式示例：
{
  "title": "${getDefaultFileName()}",
  "questions": [...]
}`

      const userPrompt = `请根据以下参考文档生成变式试卷：

${fileInfo}`

      // 准备 DeepSeek API 请求数据（流式输出）
      const requestData = {
        model: apiModel.value,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        thinking: { type: "enabled" },
        reasoning_effort: "high",
        stream: true,
        stream_options: {
          include_usage: true
        }
      }

      console.log('准备发送请求到:', apiUrl.value)
      console.log('请求数据大小:', JSON.stringify(requestData).length, '字符')
      
      const response = await fetch(apiUrl.value, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.value}`
        },
        body: JSON.stringify(requestData)
      })

      console.log('请求已发送，响应状态:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API 请求失败: ${response.status} - ${errorText}`)
      }

      // 处理流式响应
      return await handleStreamResponse(response)
    } catch (err) {
      console.error('API 请求失败:', err)
      throw new Error(err.message || 'API 请求失败')
    }
  }

  // 处理流式响应
  const handleStreamResponse = async (response) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let fullContent = ''
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              continue
            }
            try {
              const json = JSON.parse(data)
              if (json.choices && json.choices[0] && json.choices[0].delta) {
                const delta = json.choices[0].delta
                if (delta.content) {
                  fullContent += delta.content
                  streamContent.value = fullContent
                  console.log('接收内容片段:', delta.content.length, '字符')
                }
              }
            } catch (e) {
              console.warn('解析流式数据失败:', e)
            }
          }
        }
      }
      
      console.log('流式接收完成，总长度:', fullContent.length)
      
      // 尝试解析最终结果
      const paperData = extractJSONFromContent(fullContent)
      if (paperData) {
        streamContent.value = ''
        return paperData
      }
      
      throw new Error('API 返回的内容无法解析为有效的 JSON 格式')
    } finally {
      reader.releaseLock()
    }
  }

  // 从内容中提取 JSON
  const extractJSONFromContent = (content) => {
    if (!content || content.trim().length === 0) {
      return null
    }
    
    console.log('尝试从内容中提取 JSON，内容长度:', content.length)
    console.log('内容前200字符:', content.substring(0, 200))
    
    // 尝试直接解析
    try {
      const data = JSON.parse(content.trim())
      console.log('直接解析 JSON 成功')
      return data
    } catch (e) {
      console.log('直接解析失败，尝试提取 JSON 块')
    }
    
    // 尝试提取 markdown 代码块中的 JSON
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        const data = JSON.parse(codeBlockMatch[1].trim())
        console.log('从代码块解析 JSON 成功')
        return data
      } catch (e) {
        console.log('代码块解析失败')
      }
    }
    
    // 尝试找到 JSON 对象的开始和结束
    const jsonStart = content.indexOf('{')
    const jsonEnd = content.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      try {
        const jsonStr = content.substring(jsonStart, jsonEnd + 1)
        const data = JSON.parse(jsonStr)
        console.log('从文本中提取 JSON 成功')
        return data
      } catch (e) {
        console.log('文本提取 JSON 失败')
      }
    }
    
    // 尝试找到 JSON 数组
    const arrStart = content.indexOf('[')
    const arrEnd = content.lastIndexOf(']')
    if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
      try {
        const jsonStr = content.substring(arrStart, arrEnd + 1)
        const data = JSON.parse(jsonStr)
        console.log('从文本中提取 JSON 数组成功')
        return data
      } catch (e) {
        console.log('文本提取 JSON 数组失败')
      }
    }
    
    console.log('无法从内容中提取有效的 JSON')
    return null
  }

  // 读取文件内容
  const readFileContent = async (file) => {
    if (!file) {
      return ''
    }
    
    // Element Plus 的 upload 组件会包装文件对象，需要获取原始文件
    const rawFile = file.raw || file
    
    // 检查是否是有效的 Blob 对象
    if (!(rawFile instanceof Blob)) {
      console.warn('不是有效的文件对象:', rawFile)
      return ''
    }
    
    const fileName = file.name || rawFile.name || 'unknown'
    const fileType = rawFile.type || ''
    
    console.log(`开始处理文件: ${fileName}, 类型: ${fileType}`)
    
    try {
      // 文本文件
      if (fileType.includes('text') || fileType.includes('json')) {
        return await readAsText(rawFile)
      }
      
      // PDF 文件
      if (fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
        return await extractTextFromPDF(rawFile)
      }
      
      // DOCX 文件
      if (fileType.includes('docx') || fileName.toLowerCase().endsWith('.docx')) {
        return await extractTextFromDOCX(rawFile)
      }
      
      // 图片文件
      if (fileType.includes('image') || 
          fileName.toLowerCase().match(/\.(png|jpg|jpeg|gif|bmp|webp)$/)) {
        return await extractTextFromImage(rawFile)
      }
      
      // 默认处理为文本
      return await readAsText(rawFile)
    } catch (error) {
      console.error(`处理文件 ${fileName} 失败:`, error)
      return `[文件处理失败: ${fileName}]`
    }
  }
  
  // 读取为文本
  const readAsText = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => resolve('')
      reader.readAsText(blob)
    })
  }
  
  // 从PDF提取文本
  const extractTextFromPDF = async (pdfBlob) => {
    const { getDocument } = await import('pdfjs-dist/build/pdf')
    const pdfData = new Uint8Array(await pdfBlob.arrayBuffer())
    
    const pdf = await getDocument({ data: pdfData }).promise
    let text = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map(item => item.str).join(' ')
      text += `\n\n--- 第 ${i} 页 ---\n\n${pageText}`
    }
    
    console.log('PDF提取完成，文本长度:', text.length)
    return text
  }
  
  // 从DOCX提取文本
  const extractTextFromDOCX = async (docxBlob) => {
    const mammoth = await import('mammoth')
    const arrayBuffer = await docxBlob.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value || ''
  }
  
  // 从图片提取文本（OCR）
  const extractTextFromImage = async (imageBlob) => {
    const { createWorker } = await import('tesseract.js')
    
    // 新版本的 tesseract.js 中，createWorker 已经包含了语言加载和初始化
    const worker = await createWorker('chi_sim+eng')
    
    try {
      const result = await worker.recognize(imageBlob)
      console.log('OCR识别完成，文本长度:', result.data.text.length)
      return result.data.text
    } finally {
      await worker.terminate()
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    files,
    difficulty,
    coefficient,
    showAnswer,
    showAnalysis,
    paper,
    isGenerating,
    error,
    apiUrl,
    apiKey,
    apiModel,
    useCustomApi,
    streamContent,
    paperFileName,
    addFiles,
    removeFile,
    clearFiles,
    generate,
    setDifficulty,
    setCoefficient,
    toggleShowAnswer,
    toggleShowAnalysis,
    setApiConfig,
    clearError,
    setPaperFileName,
    getDefaultFileName
  }
})
