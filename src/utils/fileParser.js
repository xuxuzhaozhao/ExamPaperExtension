import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js'

export const parseFile = async (file) => {
  const fileType = file.type

  if (fileType.includes('image/')) {
    return parseImage(file)
  } else if (fileType.includes('application/pdf')) {
    return parsePDF(file)
  } else if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    return parseDOCX(file)
  } else if (fileType.includes('application/msword')) {
    return parseDOC(file)
  }

  return {
    success: false,
    message: '不支持的文件类型'
  }
}

const parseImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve({
        success: true,
        type: 'image',
        content: e.target.result,
        fileName: file.name
      })
    }
    reader.readAsDataURL(file)
  })
}

const parsePDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const numPages = pdf.numPages
    const textContent = []

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i)
      const text = await page.getTextContent()
      textContent.push(...text.items.map(item => item.str))
    }

    return {
      success: true,
      type: 'pdf',
      content: textContent.join('\n'),
      fileName: file.name,
      pageCount: numPages
    }
  } catch (error) {
    return {
      success: false,
      message: 'PDF解析失败: ' + error.message
    }
  }
}

const parseDOCX = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    
    return {
      success: true,
      type: 'docx',
      content: result.value,
      fileName: file.name,
      messages: result.messages
    }
  } catch (error) {
    return {
      success: false,
      message: 'DOCX解析失败: ' + error.message
    }
  }
}

const parseDOC = (file) => {
  return {
    success: false,
    message: '不支持旧版DOC格式，请使用DOCX格式'
  }
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  const iconMap = {
    pdf: 'FileText',
    doc: 'FileText',
    docx: 'FileText',
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image'
  }
  return iconMap[ext] || 'File'
}
