# Tasks: DAG 需求节点维护系统

**Feature**: 001-dag-node-mgmt
**Branch**: `001-dag-node-mgmt`
**Generated**: 2026-03-05

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 28 |
| User Stories | 5 |
| MVP Tasks | 12 |

---

## Implementation Strategy

**MVP Scope**: User Story 1 - 创建和管理项目任务节点

MVP 优先实现核心 DAG 数据结构和树状 UI 展示，交付后可独立测试。后续 User Stories 增量实现。

---

## Dependencies Graph

```
Phase 1: Setup
    ↓
Phase 2: Foundational (Models, Storage, Utils)
    ↓
Phase 3: US1 - 创建和管理项目任务节点 [P1]
    ↓
Phase 4: US2 - 逐层细化单个节点 [P1]
Phase 5: US3 - 动态增删改节点 [P1]
    ↓
Phase 6: US4 - MCP 服务 [P2]
Phase 7: US5 - 任务编译输出 [P2]
    ↓
Phase 8: Polish
```

---

## Phase 1: Setup

Project initialization and tooling setup.

- [X] T001 Initialize Vite + React + TypeScript project
- [X] T002 Install dependencies (zustand, uuid, express, cors)
- [X] T003 Configure ESLint and Prettier
- [X] T004 Create project directory structure per plan.md
- [X] T005 Initialize git repository and create initial commit

---

## Phase 2: Foundational

Core infrastructure (blocking prerequisites for all user stories).

- [X] T006 [P] Create Node type definitions in src/models/Node.ts
- [X] T007 [P] Create DAGState type definitions in src/models/DAGState.ts
- [X] T008 [P] Create topological sort utility in src/utils/topological-sort.ts
- [X] T009 [P] Create cycle detection utility in src/utils/cycle-detection.ts
- [X] T010 Create FileStorage service in src/storage/FileStorage.ts

**Independent Test**: All foundational tasks can be tested independently via unit tests.

---

## Phase 3: User Story 1 - 创建和管理项目任务节点 [P1]

**Goal**: 用户可以创建项目任务节点，并以树状结构查看和管理这些节点。

**Independent Test**: 通过创建一组任务节点，然后以树状视图查看它们的父子层级关系来独立测试。

### Tests

- [ ] T011 [US1] Write unit tests for DAG model in tests/unit/DAG.test.ts

### Implementation

- [X] T012 [US1] Implement DAG class in src/models/DAG.ts
- [X] T013 [US1] Implement NodeService in src/services/NodeService.ts
- [X] T014 [US1] Create TreeView component in src/ui/components/TreeView/TreeView.tsx
- [X] T015 [US1] Create TreeNode component in src/ui/components/TreeView/TreeNode.tsx
- [X] T016 [US1] Create NodeEditor component in src/ui/components/NodeEditor/NodeEditor.tsx
- [X] T017 [US1] Create Toolbar component in src/ui/components/Toolbar/Toolbar.tsx
- [X] T018 [US1] Create useDAGStore Zustand store in src/ui/hooks/useDAGStore.ts
- [X] T019 [US1] Build main App layout in src/ui/App.tsx
- [X] T020 [US1] Integrate FileStorage with NodeService

---

## Phase 4: User Story 2 - 逐层细化单个节点 [P1]

**Goal**: 用户能够选中任意节点，触发细化流程，将粗粒度任务拆解为更细的子任务。

**Independent Test**: 通过创建一个粗粒度节点，然后触发细化操作，检查是否生成了合理的子任务列表。

### Implementation

- [ ] T021 [US2] Create refine prompt template in src/services/templates/refine-prompt.ts
- [ ] T022 [US2] Implement RefineService in src/services/RefineService.ts
- [ ] T023 [US2] Add refine trigger button to Toolbar
- [ ] T024 [US2] Implement refinement result review UI in NodeEditor

---

## Phase 5: User Story 3 - 动态增删改节点 [P1]

**Goal**: 用户能够灵活地添加新节点、编辑现有节点内容、删除节点，系统自动处理依赖关系。

**Independent Test**: 可以通过添加、编辑、删除节点来验证系统的动态管理能力。

### Implementation

- [X] T025 [US3] Implement undo/redo functionality in useDAGStore
- [X] T026 [US3] Add delete confirmation dialog in TreeView
- [X] T027 [US3] Handle cascade delete and dependency cleanup in NodeService

---

## Phase 6: User Story 4 - MCP 服务：节点依赖查询 [P2]

**Goal**: 提供独立的 MCP 服务接口，支持通过 API 查询节点状态和依赖关系，供其他系统调用。

**Independent Test**: 可以通过调用 MCP 服务 API，查询指定节点的依赖项和被依赖项来独立测试。

### Tests

- [ ] T028 [US4] Write contract tests for MCP API in tests/contract/mcp-api.test.ts

### Implementation

- [ ] T029 [US4] Create MCP server in src/mcp/server.ts
- [ ] T030 [US4] Create MCP request handlers in src/mcp/handlers.ts
- [ ] T031 [US4] Implement nodes endpoints (GET/POST/PUT/DELETE)
- [ ] T032 [US4] Implement dependencies endpoints

---

## Phase 7: User Story 5 - 任务编译输出 [P2]

**Goal**: 用户能够将 DAG 结构的任务树编译为线性的任务列表，供下游执行端使用。

**Independent Test**: 可以通过触发任务编译，生成 task.json 并验证其内容是否正确。

### Implementation

- [ ] T033 [US5] Implement CompilerService in src/services/CompilerService.ts
- [ ] T034 [US5] Add compile endpoint to MCP server
- [ ] T035 [US5] Implement task.json export functionality in UI

---

## Phase 8: Polish & Cross-Cutting Concerns

Final improvements and edge case handling.

- [ ] T036 Add loading states for async operations
- [ ] T037 Add error handling and user-friendly error messages
- [ ] T038 Verify all acceptance scenarios from spec.md
- [ ] T039 Final code review and cleanup
- [ ] T040 Update documentation

---

## Parallel Execution Opportunities

The following tasks can be executed in parallel (different files, no dependencies):

- **Phase 2**: T006, T007, T008, T009 (all foundational utilities/models)
- **Phase 3**: T012, T013 (DAG and NodeService can be developed in parallel once types exist)
- **Phase 6**: T031, T032 (different endpoints can be implemented in parallel)

---

## MVP Recommendation

**MVP Scope**: Phase 1-3 (T001-T020)

完成 MVP 后，系统具备：
- DAG 数据结构
- 树状 UI 展示
- 基础 CRUD 操作
- JSON 文件持久化

MVP 可独立交付并测试。后续 phases 可增量添加。
