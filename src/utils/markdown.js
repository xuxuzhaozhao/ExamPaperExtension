import katex from 'katex'
import MarkdownIt from 'markdown-it'

// 创建基础的 markdown 渲染器（不包含数学公式）
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})

// 渲染数学公式
const renderMath = (formula, displayMode = false) => {
  try {
    return katex.renderToString(formula, {
      displayMode,
      throwOnError: false,
      errorColor: '#CC0000',
      strict: false,
      trust: true
    })
  } catch (e) {
    return `<span class="math-error" style="color: #CC0000;">${formula}</span>`
  }
}

// 处理数学公式 - 使用特殊标记来避免与markdown冲突
const mathPlaceholder = '\u200B\u200B\u200B' // 三个零宽空格作为占位符基础

export const renderMarkdown = (src) => {
  const text = src ?? ''
  
  // 第一步：提取所有数学公式并用唯一占位符替换
  const mathBlocks = []
  let processedText = text
  
  // 处理行间公式 $$...$$
  const displayRegex = /\$\$([\s\S]*?)\$\$/g
  processedText = processedText.replace(displayRegex, (match, formula) => {
    const index = mathBlocks.push({ type: 'display', content: formula }) - 1
    return `${mathPlaceholder}DISPLAY_${index}${mathPlaceholder}`
  })
  
  // 处理行内公式 $...$
  const inlineRegex = /\$([^$\n]+?)\$/g
  processedText = processedText.replace(inlineRegex, (match, formula) => {
    const index = mathBlocks.push({ type: 'inline', content: formula }) - 1
    return `${mathPlaceholder}INLINE_${index}${mathPlaceholder}`
  })
  
  // 处理 LaTeX 数学环境 \(...\) 和 \[...\]
  const latexInlineEnvRegex = /\\\(([\s\S]*?)\\\)/g
  processedText = processedText.replace(latexInlineEnvRegex, (match, formula) => {
    const index = mathBlocks.push({ type: 'inline', content: formula }) - 1
    return `${mathPlaceholder}INLINE_${index}${mathPlaceholder}`
  })
  
  const latexDisplayEnvRegex = /\\\[([\s\S]*?)\\\]/g
  processedText = processedText.replace(latexDisplayEnvRegex, (match, formula) => {
    const index = mathBlocks.push({ type: 'display', content: formula }) - 1
    return `${mathPlaceholder}DISPLAY_${index}${mathPlaceholder}`
  })
  
  // 处理未被包裹的数学表达式
  // 匹配模式：\command 或 \command{...} 或 \command{...}{...} 或 \char
  const latexRegex = /(\\(?:[a-zA-Z]+)(?:\{\{[^}]+\}\}|\{[^{}]+\}|\{[^{}]+\}\{[^{}]+\})?|\\[^a-zA-Z])/g
  
  processedText = processedText.replace(latexRegex, (match) => {
    const index = mathBlocks.push({ type: 'inline', content: match }) - 1
    return `${mathPlaceholder}INLINE_${index}${mathPlaceholder}`
  })
  
  // 第二步：渲染 markdown（此时数学公式已被占位符替换）
  let html = md.render(processedText)
  
  // 第三步：将占位符替换为 KaTeX 渲染的公式
  mathBlocks.forEach((block, index) => {
    const rendered = renderMath(block.content, block.type === 'display')
    const wrapper = block.type === 'display'
      ? `<div class="math-block">${rendered}</div>`
      : `<span class="math-inline">${rendered}</span>`
    const placeholder = `${mathPlaceholder}${block.type.toUpperCase()}_${index}${mathPlaceholder}`
    html = html.split(placeholder).join(wrapper)
  })
  
  return html
}

export const renderInlineMath = (src) => {
  const text = src ?? ''
  return text.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
    return `<span class="math-inline">${renderMath(formula, false)}</span>`
  })
}
