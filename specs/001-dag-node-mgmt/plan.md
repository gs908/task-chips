# Implementation Plan: DAG 需求节点维护系统

**Branch**: `001-dag-node-mgmt` | **Date**: 2026-03-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dag-node-mgmt/spec.md`

## Summary

构建一个基于 DAG 的需求节点维护系统，用于长时运行编码 Agent 的任务规划。核心功能包括：DAG 节点 CRUD、树状结构可视化展示、单节点逐层细化、MCP 服务（依赖查询）、任务编译输出。MVP 阶段优先实现基础 CRUD + 树状展示 + 简单 MCP 服务。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18+, Zustand (状态管理), @model-viewer/tree 或自定义树组件
**Storage**: JSON 文件持久化 (plan_tree.json)
**Testing**: Vitest + React Testing Library
**Target Platform**: Web 浏览器 (Desktop 优先)
**Project Type**: Web 应用 (MVP: 简化版 UI，后续可迁移到 Streamlit)
**Performance Goals**: MCP 查询 <200ms, 树渲染 <100ms (100节点), 编译 <1s (1000节点)
**Constraints**: MCP 服务需支持独立部署为 HTTP API
**Scale/Scope**: MVP 阶段支持 1000 节点规模

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| TypeScript strict mode | ✅ PASS | 使用 TypeScript 5.x |
| React for UI | ✅ PASS | 使用 React 18+ |
| 测试标准 | ✅ PASS | Vitest + Testing Library |
| 代码质量 | ✅ PASS | ESLint + Prettier |
| 性能要求 | ✅ PASS | MCP <200ms, 编译 <1s |

**Conclusion**: 所有 Constitution gates 通过。

## Project Structure

### Documentation (this feature)

```text
specs/001-dag-node-mgmt/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── mcp-api.md      # MCP 服务接口定义
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── models/              # 数据模型定义
│   ├── Node.ts          # 节点类型定义
│   ├── DAG.ts           # DAG 操作类
│   └── TaskList.ts      # 任务列表编译
├── services/            # 业务逻辑
│   ├── NodeService.ts   # 节点 CRUD 服务
│   ├── RefineService.ts # 节点细化服务
│   └── CompilerService.ts # 任务编译服务
├── mcp/                 # MCP 服务
│   ├── server.ts        # MCP HTTP 服务
│   └── handlers.ts      # MCP 请求处理器
├── ui/                  # React UI 组件
│   ├── components/      # UI 组件
│   │   ├── TreeView/   # 树状视图组件
│   │   ├── NodeEditor/ # 节点编辑器
│   │   └── Toolbar/    # 工具栏
│   ├── hooks/          # 自定义 hooks
│   └── App.tsx         # 主应用
├── storage/             # 持久化
│   └── FileStorage.ts  # JSON 文件读写
└── utils/               # 工具函数
    ├── topological-sort.ts # 拓扑排序
    └── cycle-detection.ts  # 循环检测

tests/
├── unit/                # 单元测试
│   ├── DAG.test.ts
│   ├── NodeService.test.ts
│   └── CompilerService.test.ts
├── integration/         # 集成测试
│   └── e2e.test.ts
└── contract/           # 契约测试
    └── mcp-api.test.ts

data/
└── plan_tree.json      # DAG 数据存储
```

**Structure Decision**: 单项目结构，UI + 核心逻辑同构。MCP 服务作为独立模块，可单独部署。MVP 阶段将 MCP 服务与主应用共存，后续可拆分为独立服务。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无需 complexity tracking，所有 Constitution gates 通过。

---

# Phase 0: Outline & Research

## Unknowns Identified

以下问题需要在研究阶段解决：

1. **树状 UI 组件选择** - 自定义实现 vs 使用现有库
2. **MCP 服务协议** - MCP 的具体协议格式和实现方式
3. **DAG 数据模型设计** - 如何在支持树状展示的同时维护 DAG 结构
4. **节点细化 Prompt 设计** - LLM 细化的提示词模板

## Research Tasks

### Task 1: 树状 UI 组件调研
**目标**: 评估 React 生态中适合展示可展开/折叠节点的树状组件
**评估标准**: 性能、定制能力、TypeScript 支持

### Task 2: MCP 服务协议研究
**目标**: 了解 MCP (Model Context Protocol) 的接口规范和实现方式
**评估标准**: 协议简洁性、HTTP API 设计

### Task 3: DAG 数据模型设计
**目标**: 研究如何在保持 DAG 语义的同时支持树状 UI 展示
**评估标准**: 插入/删除效率、依赖查询效率

### Task 4: 节点细化 Prompt 模板
**目标**: 设计用于 LLM 细化任务的提示词模板
**评估标准**: 细化质量、上下文注入有效性

---

# Phase 1: Design & Contracts

*待 Phase 0 研究完成后填充*

### Expected Outputs

- `research.md` - 研究发现和决策
- `data-model.md` - 数据模型设计
- `contracts/mcp-api.md` - MCP 服务接口定义
- `quickstart.md` - 快速开始指南

---

## Next Steps

1. 执行 Phase 0 研究任务
2. 创建 research.md 记录研究发现
3. 基于研究结果设计 Phase 1
4. 更新 Constitution Check
