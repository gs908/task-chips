# Research: DAG 需求节点维护系统

**Date**: 2026-03-05
**Feature**: 001-dag-node-mgmt

---

## Decision 1: 树状 UI 组件选择

**选择**: 自定义实现 (基于 React 递归组件)

**理由**:
- 现有树状组件库（如 react-arborist, @model-viewer/tree）功能过于复杂，引入不必要依赖
- 项目需要高度定制：节点状态图标、拖拽调整、编辑态切换
- 递归组件实现简单，性能可控（支持虚拟化）
- TypeScript 类型友好

**替代方案评估**:
- react-arist: 功能全但体积大，定制成本高
- @model-viewer/tree: 仅支持只读展示
- antd Tree: 样式重，不适合轻量级需求

---

## Decision 2: MCP 服务协议

**选择**: HTTP REST API + JSON-RPC 风格

**理由**:
- MCP (Model Context Protocol) 本质是标准化上下文传递
- MVP 阶段使用简单 HTTP API 即可满足
- 后续可升级为标准 MCP 协议

**接口设计**:
```
GET  /api/nodes              # 获取所有节点
GET  /api/nodes/:id          # 获取单个节点
POST /api/nodes              # 创建节点
PUT  /api/nodes/:id          # 更新节点
DELETE /api/nodes/:id        # 删除节点
GET  /api/nodes/:id/deps     # 获取节点依赖
GET  /api/nodes/:id/reverse  # 获取被依赖项
POST /api/compile            # 编译任务列表
```

**替代方案评估**:
- 标准 MCP 协议: 过于复杂，MVP 阶段不需要
- GraphQL: 引入额外复杂度

---

## Decision 3: DAG 数据模型设计

**选择**: 混合模型 - 树结构用于展示，DAG 用于逻辑

**理由**:
- UI 需要树状展示（父子关系）
- 逻辑需要 DAG（支持跨分支依赖）
- 分离展示模型和逻辑模型，解耦清晰

**数据结构**:
```typescript
interface Node {
  id: string;
  parentId: string | null;      // 树结构：父节点
  title: string;
  description: string;
  type: 'module' | 'task' | 'subtask';
  status: 'pending' | 'refining' | 'done' | 'blocked';
  context: string;
  dependencies: string[];       // DAG：依赖的其他节点 ID
  children: string[];           // 缓存：子节点 ID 列表
  createdAt: string;
  updatedAt: string;
}

interface DAGState {
  nodes: Map<string, Node>;
  rootIds: string[];            // 根节点 ID 列表
}
```

**关键操作**:
- 添加节点时：更新 parentId + children 缓存
- 添加依赖时：检测循环 (DFS)
- 删除节点时：级联处理 children + 清理 dependencies

---

## Decision 4: 节点细化 Prompt 模板

**选择**: 结构化 Prompt 模板

**理由**:
- 需要注入 Constitution + 局部上下文
- 标准化输出格式便于程序解析

**Prompt 模板结构**:
```
## 角色
你是一个任务拆解专家。

## 上下文
项目 Constitution:
{CONSTITUTION_CONTENT}

相关节点信息:
{NODE_CONTEXT}

## 任务
细化节点 "{NODE_TITLE}": {NODE_DESCRIPTION}

请生成子任务列表，输出格式:
{{
  "sub_tasks": [
    {{"title": "任务标题", "description": "任务描述", "type": "task|subtask"}}
  ]
}}
```

---

## Summary

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 树状 UI | 自定义递归组件 | 轻量、可定制 |
| MCP 协议 | HTTP REST API | 简单、够用 |
| 数据模型 | 树+DAG 混合 | 解耦展示与逻辑 |
| 细化 Prompt | 结构化模板 | 标准化、可注入上下文 |

所有 [NEEDS CLARIFICATION] 问题已解决。
