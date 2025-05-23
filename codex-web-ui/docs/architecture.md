# Codex Web UI 架构文档

## 系统架构图

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   React 前端     |<--->|   Express 后端   |<--->|   Codex CLI      |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
        ^                        ^                        ^
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   浏览器存储     |     |   SQLite 数据库  |     |   文件系统      |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
```

## 核心组件

### 前端组件

1. **文件浏览器 (FileExplorer)**
   - 浏览项目文件结构
   - 查看文件内容
   - 创建/删除文件和目录

2. **代码编辑器 (CodeEditor)**
   - 基于 Monaco Editor
   - 语法高亮
   - 代码编辑和保存

3. **任务管理器 (TaskManager)**
   - 创建新任务
   - 查看任务列表
   - 过滤和排序任务

4. **任务详情 (TaskDetail)**
   - 查看任务输出
   - 查看文件变更
   - 批准/拒绝变更
   - 中断任务
   - 回滚任务

### 后端组件

1. **文件服务 (FileController)**
   - 获取文件列表
   - 读取文件内容
   - 更新文件内容

2. **任务服务 (TaskController)**
   - 创建任务
   - 获取任务列表和详情
   - 中断任务
   - 回滚任务
   - 处理交互请求

3. **Codex 服务 (CodexService)**
   - 与 Codex CLI 交互
   - 执行命令
   - 处理输出
   - 处理交互

4. **WebSocket 服务**
   - 实时任务状态更新
   - 实时输出流
   - 交互请求和响应

## 数据流

### 任务创建流程

```
+-------------+     +-------------+     +-------------+     +-------------+
|             |     |             |     |             |     |             |
|  用户界面   |---->|  后端 API   |---->| Codex 服务  |---->|  Codex CLI  |
|             |     |             |     |             |     |             |
+-------------+     +-------------+     +-------------+     +-------------+
                          |                   ^
                          v                   |
                    +-------------+     +-------------+
                    |             |     |             |
                    | 数据库存储  |     | WebSocket   |
                    |             |     |             |
                    +-------------+     +-------------+
                                              |
                                              v
                                        +-------------+
                                        |             |
                                        |  用户界面   |
                                        |             |
                                        +-------------+
```

### 文件编辑流程

```
+-------------+     +-------------+     +-------------+
|             |     |             |     |             |
|  代码编辑器 |---->|  后端 API   |---->|  文件系统   |
|             |     |             |     |             |
+-------------+     +-------------+     +-------------+
```

### 任务交互流程

```
+-------------+     +-------------+     +-------------+
|             |     |             |     |             |
|  Codex CLI  |---->| WebSocket   |---->|  用户界面   |
|             |     |             |     |             |
+-------------+     +-------------+     +-------------+
      ^                                       |
      |                                       v
      |                               +-------------+
      |                               |             |
      +-------------------------------|  用户响应   |
                                      |             |
                                      +-------------+
```

## 技术栈

### 前端
- React
- TypeScript
- Tailwind CSS
- Monaco Editor
- React Router
- Axios
- WebSocket

### 后端
- Node.js
- Express
- TypeScript
- SQLite
- WebSocket
- Child Process (与 Codex CLI 交互)

## 数据模型

### Task (任务)
```typescript
interface Task {
  id: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: Date;
  scheduledFor: Date | null;
  completedAt: Date | null;
  approvalMode: 'manual' | 'auto' | 'semi-auto';
  output: string;
  changes: FileChange[];
}
```

### FileChange (文件变更)
```typescript
interface FileChange {
  path: string;
  operation: 'create' | 'modify' | 'delete';
  diff?: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

### Interaction (交互)
```typescript
interface Interaction {
  id: string;
  taskId: string;
  type: 'confirmation' | 'input' | 'choice';
  message: string;
  options?: string[];
  response?: string;
  timestamp: Date;
}
```