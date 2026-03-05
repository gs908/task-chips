# MCP Service API Contract

**Version**: 1.0.0
**Base URL**: `http://localhost:3001/api`

---

## Overview

MCP (Model Context Protocol) 服务提供 DAG 节点的状态查询接口，供外部系统（如执行端 Agent）调用。

---

## Endpoints

### Nodes

#### GET /nodes

获取所有节点。

**Response**:
```json
{
  "success": true,
  "data": {
    "nodes": [...],
    "rootIds": [...]
  }
}
```

---

#### GET /nodes/:id

获取指定节点。

**Response**:
```json
{
  "success": true,
  "data": { ...Node }
}
```

---

#### POST /nodes

创建新节点。

**Request Body**:
```json
{
  "parentId": "uuid or null",
  "title": "string",
  "description": "string",
  "type": "module | task | subtask"
}
```

**Response**:
```json
{
  "success": true,
  "data": { ...Node }
}
```

---

#### PUT /nodes/:id

更新节点。

**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "status": "pending | refining | done | blocked",
  "context": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": { ...Node }
}
```

---

#### DELETE /nodes/:id

删除节点。

**Query Parameters**:
- `cascade`: `true` - 级联删除子节点；`false` (默认) - 转为根节点

**Response**:
```json
{
  "success": true
}
```

---

### Dependencies

#### GET /nodes/:id/dependencies

获取节点的依赖项（该节点依赖哪些节点）。

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "title": "string" }
  ]
}
```

---

#### GET /nodes/:id/reverse

获取被依赖项（哪些节点依赖该节点）。

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "title": "string" }
  ]
}
```

---

#### POST /nodes/:id/dependencies

添加依赖。

**Request Body**:
```json
{
  "targetId": "uuid"
}
```

**Response**:
```json
{
  "success": true
}
```

**Error** (循环依赖):
```json
{
  "success": false,
  "error": {
    "code": "CYCLE_DETECTED",
    "message": "Adding this dependency would create a cycle"
  }
}
```

---

#### DELETE /nodes/:id/dependencies/:targetId

移除依赖。

**Response**:
```json
{
  "success": true
}
```

---

### Compilation

#### POST /compile

编译任务列表。

**Response**:
```json
{
  "success": true,
  "data": {
    "tasks": [...CompiledTask],
    "totalCount": 10,
    "compiledAt": "2026-03-05T12:00:00Z"
  }
}
```

---

## Error Responses

所有错误响应遵循以下格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

**Error Codes**:

| Code | Description |
|------|-------------|
| NOT_FOUND | 节点不存在 |
| CYCLE_DETECTED | 添加依赖会形成循环 |
| VALIDATION_ERROR | 请求参数验证失败 |
| INTERNAL_ERROR | 服务器内部错误 |

---

## Performance Requirements

- 查询响应时间: P95 < 200ms
- 编译响应时间: P95 < 1000ms (1000 节点内)
- 并发支持: 10 请求/秒
