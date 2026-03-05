# Data Model: DAG 需求节点维护系统

**Date**: 2026-03-05

---

## Core Entities

### Node (节点)

代表业务模块或具体任务。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | 唯一标识符 (UUID) |
| parentId | string \| null | Yes | 父节点 ID，根节点为 null |
| title | string | Yes | 节点标题 |
| description | string | No | 节点详细描述 |
| type | NodeType | Yes | 节点类型 |
| status | NodeStatus | Yes | 节点状态 |
| context | string | No | 上下文信息（用于 LLM 细化） |
| dependencies | string[] | Yes | 依赖的其他节点 ID 列表 |
| children | string[] | Yes | 子节点 ID 列表（缓存） |
| createdAt | ISO8601 | Yes | 创建时间 |
| updatedAt | ISO8601 | Yes | 更新时间 |

**Type Enum**:
```typescript
type NodeType = 'module' | 'task' | 'subtask';
```

**Status Enum**:
```typescript
type NodeStatus = 'pending' | 'refining' | 'done' | 'blocked';
```

---

### DAGState (DAG 状态)

整个项目的任务拓扑状态。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| nodes | Map<string, Node> | Yes | 节点集合 |
| rootIds | string[] | Yes | 根节点 ID 列表 |
| version | string | Yes | 状态版本号 |

---

### TaskList (任务列表)

编译输出的线性任务序列。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tasks | CompiledTask[] | Yes | 线性任务列表 |
| compiledAt | ISO8601 | Yes | 编译时间 |
| totalCount | number | Yes | 任务总数 |

**CompiledTask**:
```typescript
interface CompiledTask {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  parentGoal: string;           // 父级业务目标
  dependencies: string[];       // 前置依赖任务
  dependencyOutputs: string[];  // 依赖任务的预期输出文件路径
  order: number;                // 执行顺序
}
```

---

## Validation Rules

### Node

- `id`: 非空，UUID 格式
- `title`: 非空，最大 200 字符
- `parentId`: 如果非 null，必须指向存在的节点
- `dependencies`: 不能包含自身，不能形成循环

### DAGState

- `nodes`: 至少存在一个根节点（除非清空状态）
- 所有节点必须有唯一 id
- 根节点的 parentId 必须为 null

---

## State Transitions

### Node Status Flow

```
pending → refining → pending
pending → blocked
blocked → pending
* → done (人工标记完成)
```

### Cycle Detection

添加依赖时必须检测循环：
1. 构建临时图
2. 使用 DFS 检测环路
3. 如果检测到环路，拒绝添加依赖并返回错误

---

## Relationships

```
DAGState (1) ────── (*) ────── Node (1) ────── (*) ────── Node (self-reference via dependencies)
     │
     │
     └── TaskList
```

---

## Persistence

数据持久化到 JSON 文件：

**文件**: `data/plan_tree.json`

**格式**:
```json
{
  "version": "1.0.0",
  "nodes": {
    "node-uuid-1": { ... },
    "node-uuid-2": { ... }
  },
  "rootIds": ["node-uuid-1"],
  "updatedAt": "2026-03-05T12:00:00Z"
}
```
