import sampleData from '../assets/sample.json'

export const generateMockPaper = async (difficulty, coefficient) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const basePaper = JSON.parse(JSON.stringify(sampleData))
      
      basePaper.title = `高三数学变式试卷（难度${difficulty} / 系数${coefficient}）`
      basePaper.meta = {
        difficulty,
        coefficient,
        createdAt: new Date().toLocaleString('zh-CN')
      }

      basePaper.sections.forEach(section => {
        section.questions.forEach(question => {
          question.stem = transformStem(question.stem, difficulty, coefficient)
          if (question.options) {
            question.options = question.options.map(opt => transformOption(opt, difficulty))
          }
          question.analysis = transformAnalysis(question.analysis, coefficient)
        })
      })

      resolve(basePaper)
    }, 1500)
  })
}

const transformStem = (stem, difficulty, coefficient) => {
  if (difficulty > 7) {
    stem = stem.replace(/简单/g, '复杂')
    stem = stem.replace(/基础/g, '进阶')
  }
  
  if (coefficient > 3) {
    stem += '（综合拓展题）'
  }
  
  return stem
}

const transformOption = (option, difficulty) => {
  if (difficulty > 5) {
    const chars = ['A', 'B', 'C', 'D', 'E', 'F']
    const randomChar = chars[Math.floor(Math.random() * chars.length)]
    const num = Math.floor(Math.random() * 10) + 1
    return option.replace(/\$/g, `$${randomChar}_${num}`)
  }
  return option
}

const transformAnalysis = (analysis, coefficient) => {
  if (coefficient > 4) {
    return analysis + '\n\n**拓展思考**：本题可进一步拓展到相关知识点，如多元函数微积分、级数收敛性判定等方向。'
  }
  return analysis
}
