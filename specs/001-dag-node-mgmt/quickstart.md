# Quick Start: DAG 需求节点维护系统

---

## Prerequisites

- Node.js 18+
- npm 或 yarn

---

## Installation

```bash
# 克隆项目后安装依赖
npm install

# 或使用 bun
bun install
```

---

## Development

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 启动 MCP 服务

```bash
npm run mcp
```

MCP 服务运行在 http://localhost:3001

---

## Project Structure

```
src/
├── models/           # 数据模型
├── services/         # 业务逻辑
├── mcp/              # MCP 服务
├── ui/               # React 组件
├── storage/          # 持久化
└── utils/            # 工具函数

data/
└── plan_tree.json   # DAG 数据文件
```

---

## Basic Usage

### 1. 创建根节点

在 UI 工具栏点击"添加节点"，输入标题和描述。

### 2. 添加子节点

选中父节点，点击"添加子节点"。

### 3. 细化节点

选中节点，点击"细化"，输入细化指令。

### 4. 添加依赖

选中节点，在右侧面板点击"添加依赖"，选择目标节点。

### 5. 编译任务

点击"编译"，生成 task.json。

---

## API 示例

### 使用 MCP 服务

```bash
# 获取所有节点
curl http://localhost:3001/api/nodes

# 创建节点
curl -X POST http://localhost:3001/api/nodes \
  -H "Content-Type: application/json" \
  -d '{"title": "新任务", "parentId": null}'

# 获取依赖
curl http://localhost:3001/api/nodes/{id}/dependencies
```

---

## Testing

```bash
# 运行单元测试
npm run test

# 运行集成测试
npm run test:integration
```

---

## Building

```bash
# 构建生产版本
npm run build
```
