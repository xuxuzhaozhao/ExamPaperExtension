# Neon PostgreSQL 集成方案

## 概述
将每次生成的试卷数据记录到 Neon PostgreSQL 数据库中，实现数据持久化和历史记录查询。

## 数据库表设计

```sql
-- 试卷记录表
CREATE TABLE generated_papers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content JSONB NOT NULL,  -- 存储完整的试卷数据（题目、答案、解析等）
  difficulty INTEGER NOT NULL,  -- 难度系数
  coefficient INTEGER NOT NULL, -- 变式系数
  file_names TEXT[],  -- 上传的文件名列表
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引优化
CREATE INDEX idx_papers_created_at ON generated_papers(created_at);
```

## 依赖安装

```bash
npm install @neondatabase/serverless pg
```

## 文件结构

```
src/
├── utils/
│   └── db.js                    # 数据库连接工具
├── services/
│   └── paperService.js          # 试卷记录服务
├── components/
│   └── settings/
│       └── NeonConfig.vue       # 数据库配置界面
└── components/
    └── right/
        └── PaperHistory.vue     # 历史记录查看组件
```

## 配置说明

### Neon 连接字符串格式
```
postgresql://username:password@hostname:5432/database_name
```

### 环境变量设置 (可选)
在 `.env` 文件中添加:
```
NEON_DATABASE_URL=your_connection_string
```

## 安全性考虑

1. 不建议在前端直接暴露数据库连接字符串
2. 生产环境建议通过后端 API 代理数据库操作
3. 考虑使用 Neon 的 Serverless Edge Functions 作为中间层

## 部署步骤

1. 在 Neon 控制台创建数据库
2. 执行 SQL 创建表结构
3. 在前端配置连接字符串
4. 测试生成试卷并验证数据是否正确写入

## 功能特性

- ✅ 自动保存生成的试卷到数据库
- ✅ 保存试卷标题、内容、难度系数、变式系数
- ✅ 记录原始文件名
- ✅ 历史记录查询和查看
- ✅ 数据库连接配置管理
- ✅ 连接测试功能

## 数据结构

### 试卷记录
```javascript
{
  id: 1,
  title: "试卷20260605",
  content: {
    title: "变式试卷",
    questions: [
      {
        type: "选择题",
        content: "题目内容",
        options: ["A. 选项1", "B. 选项2"],
        answer: "A",
        analysis: "解析内容"
      }
    ]
  },
  difficulty: 6,
  coefficient: 1,
  file_names: ["test.pdf"],
  created_at: "2026-06-05T10:30:00Z",
  updated_at: "2026-06-05T10:30:00Z"
}
```

## API 接口

### paperService 方法

- `savePaper(paperData)` - 保存试卷
- `getAllPapers()` - 获取所有试卷记录
- `getPaperById(id)` - 根据ID获取试卷
- `deletePaper(id)` - 删除试卷记录

## 使用示例

```javascript
import { paperService } from '../services/paperService'

// 保存试卷
await paperService.savePaper({
  title: "试卷20260605",
  content: paperData,
  difficulty: 6,
  coefficient: 1,
  fileNames: ["test.pdf"]
})

// 获取历史记录
const papers = await paperService.getAllPapers()
```