# Feature Specification: DAG 需求节点维护系统

**Feature Branch**: `001-dag-node-mgmt`
**Created**: 2026-03-05
**Status**: Draft
**Input**: User description: "请参考docs/project-resume.md 中介绍的内容，进行需求描述的拆解，我想要做一个可以基于有向无环图的需求节点维护，可以先用树状结构展示。主要想要实现的是能够在单个节点上去逐层细化。也方便后续新增或者更改。其中涉及的有向无环图的维护功能后续可能会拆成mcp，方便其他地方调用，主要用于在新增或者修改节点时，查找是否有依赖或者被依赖的节点需要连带的修改。"

## User Scenarios & Testing

### User Story 1 - 创建和管理项目任务节点 (Priority: P1)

用户需要创建一个项目任务计划，并能够以树状结构查看和管理这些任务节点。

**Why this priority**: 这是系统的核心功能，用户首先需要能够创建任务节点并查看其层级结构，否则无法进行后续的细化和管理工作。

**Independent Test**: 可以通过创建一组任务节点，然后以树状视图查看它们的父子层级关系来独立测试。

**Acceptance Scenarios**:

1. **Given** 系统为空, **When** 用户创建一个新的根节点"用户认证模块", **Then** 节点成功创建并在树状视图中显示为顶层节点
2. **Given** 已存在根节点"用户认证模块", **When** 用户在该节点下创建子节点"登录接口", **Then** 子节点成功创建并在树中显示为"用户认证模块"的子节点
3. **Given** 存在多个层级节点, **When** 用户查看树状视图, **Then** 所有节点按照父子关系正确展示，子节点可展开/折叠

---

### User Story 2 - 逐层细化单个节点 (Priority: P1)

用户能够选中任意节点，触发细化流程，将粗粒度任务拆解为更细的子任务。

**Why this priority**: 这是项目规划的核心能力，允许用户从宏观到微观逐步细化任务，确保任务拆解的粒度可控。

**Independent Test**: 可以通过创建一个粗粒度节点，然后触发细化操作，检查是否生成了合理的子任务列表。

**Acceptance Scenarios**:

1. **Given** 存在粗粒度节点"用户认证模块", **When** 用户选中该节点并触发细化, **Then** 系统生成子任务列表（如：登录接口、注册接口、Token验证等）
2. **Given** 细化生成的子任务列表, **When** 用户查看并人工审核, **Then** 用户可以修改或删除不合适的子任务
3. **Given** 用户确认细化结果, **When** 细化后的子节点添加到树中, **Then** 子节点可以作为独立任务继续细化

---

### User Story 3 - 动态增删改节点 (Priority: P1)

用户能够灵活地添加新节点、编辑现有节点内容、删除节点，系统自动处理依赖关系。

**Why this priority**: 项目规划是迭代过程，用户需要能够随时调整任务结构。

**Independent Test**: 可以通过添加、编辑、删除节点来验证系统的动态管理能力。

**Acceptance Scenarios**:

1. **Given** 树中存在任意节点, **When** 用户添加新节点, **Then** 新节点成功创建并可设置父节点
2. **Given** 树中存在节点, **When** 用户编辑节点标题或描述, **Then** 节点信息成功更新
3. **Given** 树中存在节点, **When** 用户删除节点, **Then** 系统提示用户确认，并处理相关的依赖关系
4. **Given** 用户误操作, **When** 用户触发撤销, **Then** 系统恢复到操作前的状态

---

### User Story 4 - MCP 服务：节点依赖查询 (Priority: P2)

提供独立的 MCP 服务接口，支持通过 API 查询节点状态和依赖关系，供其他系统调用。

**Why this priority**: 这是项目的扩展性要求，当节点发生变更时，其他系统（如执行端 Agent）需要能够查询依赖关系以判断连带影响。

**Independent Test**: 可以通过调用 MCP 服务 API，查询指定节点的依赖项和被依赖项来独立测试。

**Acceptance Scenarios**:

1. **Given** DAG 中存在节点A依赖节点B, **When** 调用 MCP 服务查询"节点A的依赖项", **Then** 返回节点B的信息
2. **Given** DAG 中存在节点B被节点A依赖, **When** 调用 MCP 服务查询"节点B的被依赖项", **Then** 返回节点A的信息
3. **Given** 用户修改了节点A, **When** 调用 MCP 服务查找相关依赖项, **Then** 返回所有可能受影响的节点列表

---

### User Story 5 - 任务编译输出 (Priority: P2)

用户能够将 DAG 结构的任务树编译为线性的任务列表，供下游执行端使用。

**Why this priority**: 项目规划的最终目的是生成可执行的任务列表，供给长时运行 Agent 使用。

**Independent Test**: 可以通过触发任务编译，生成 task.json 并验证其内容是否正确。

**Acceptance Scenarios**:

1. **Given** DAG 中存在已完成细化的任务树, **When** 用户触发任务编译, **Then** 系统进行拓扑排序并生成线性任务列表
2. **Given** 任务列表, **When** 用户导出为 task.json, **Then** 文件包含所有叶子节点及其上下文信息
3. **Given** 存在依赖关系的任务, **When** 编译时, **Then** 被依赖的任务排在依赖任务之前

---

### Edge Cases

- 当用户尝试创建循环依赖时，系统必须阻止并提示错误
- 当用户删除有子节点的节点时，系统应提示是否级联删除或转为根节点
- 当细化引擎返回空结果时，系统应允许用户手动添加子节点
- MCP 服务调用超时时，应返回明确的错误信息而非超时

## Requirements

### Functional Requirements

- **FR-001**: 系统 MUST 支持创建、读取、更新、删除节点 (CRUD)
- **FR-002**: 系统 MUST 支持定义节点间的依赖关系（有向边）
- **FR-003**: 系统 MUST 检测并防止循环依赖的产生
- **FR-004**: 节点 MUST 包含属性：id, title, description, type, status, dependencies, children
- **FR-005**: 系统 MUST 以树状结构可视化展示 DAG
- **FR-006**: 系统 MUST 支持展开/折叠节点
- **FR-007**: 系统 MUST 支持选中任意节点触发细化流程
- **FR-008**: 细化流程 MUST 注入全局约束和局部上下文
- **FR-009**: 细化结果 MUST 支持人工审核和修改
- **FR-010**: 系统 MUST 支持手动添加新节点
- **FR-011**: 系统 MUST 支持编辑现有节点内容
- **FR-012**: 系统 MUST 支持删除节点并自动处理依赖关系
- **FR-013**: 系统 MUST 支持撤销/重做操作
- **FR-014**: 系统 MUST 提供 MCP 服务接口查询节点状态
- **FR-015**: MCP 服务 MUST 支持查询指定节点的依赖项
- **FR-016**: MCP 服务 MUST 支持查询指定节点被哪些节点依赖
- **FR-017**: 系统 MUST 支持拓扑排序
- **FR-018**: 系统 MUST 支持导出线性任务列表 (task.json)
- **FR-019**: 任务列表 MUST 包含父级目标和依赖任务的上下文信息

### Key Entities

- **节点 (Node)**: 代表业务模块或具体任务，包含 id, title, description, type, status, context, dependencies 等属性
- **依赖关系 (Dependency)**: 节点之间的有向边，表示前置任务关系
- **项目清单 (Project Manifest)**: 包含 Constitution（宏观约束）和 DAG State（运行时任务拓扑）
- **任务列表 (Task List)**: 编译输出的线性任务序列，供执行端使用

## Success Criteria

### Measurable Outcomes

- **SC-001**: 用户能够在 30 秒内创建一个包含 10 个节点的任务树并查看
- **SC-002**: 节点细化响应时间不超过 5 秒（不含 LLM 调用时间）
- **SC-003**: 100% 的循环依赖尝试被系统阻止并返回明确错误
- **SC-004**: MCP 服务查询响应时间不超过 200ms
- **SC-005**: 任务编译生成 task.json 的时间不超过 1 秒（1000 个节点以内）
- **SC-006**: 用户满意度达到 4/5 以上，能够清晰地理解任务层级结构
