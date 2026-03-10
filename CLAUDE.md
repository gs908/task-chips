# flips Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-05

## Active Technologies

- TypeScript 5.x + React 18+, Zustand (状态管理), @model-viewer/tree 或自定义树组件 (001-dag-node-mgmt)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5.x: Follow standard conventions

## Recent Changes

- 001-dag-node-mgmt: Added TypeScript 5.x + React 18+, Zustand (状态管理), @model-viewer/tree 或自定义树组件

<!-- MANUAL ADDITIONS START -->

## 开发服务器管理规则

### 启动规则
1. **必须指定端口**：使用 `npm run dev --port 3001` 避免端口冲突
2. **启动前检查**：先检查目标端口是否被占用
3. **避免重复启动**：每次启动前先终止已有的 dev server

### 端口分配
- 前端开发服务器：3001
- 后续服务：依次递增 (3002, 3003...)

### 关闭规则
1. **对话结束前**：确保关闭所有启动的开发服务器
2. **使用任务管理**：通过 `/tasks` 查看后台任务
3. **手动终止**：如进程残留，使用 `taskkill //PID <pid> //F` 终止

### 常用命令
```bash
# 检查端口占用
netstat -ano | grep "LISTENING" | grep "3001"

# 终止指定端口进程
taskkill //PID <pid> //F

# 启动开发服务器（指定端口）
npm run dev --port 3001
```
<!-- MANUAL ADDITIONS END -->
