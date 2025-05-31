# Codex CLI 调试指南

## 概述

本指南详细介绍如何在本地环境中调试 Codex CLI 源代码，包括 VSCode 调试配置、命令行调试和常见问题解决方案。

## 环境要求

- **Node.js**: >= 22.0.0 (当前版本: `node --version`)
- **包管理器**: pnpm (推荐) 或 npm
- **编辑器**: VSCode (推荐，已配置调试环境)

## 快速开始

### 1. 环境准备

```bash
# 检查 Node.js 版本
node --version  # 应显示 >= 22.x.x

# 安装依赖
pnpm install

# 构建开发版本
pnpm run build:dev
```

### 2. VSCode 调试（推荐）

1. 在 VSCode 中打开 `codex-cli` 目录
2. 按 `F5` 或 `Ctrl/Cmd + Shift + D` 打开调试面板
3. 选择调试配置：
   - **调试 Codex CLI (开发模式)**: 使用预设提示语调试
   - **调试 Codex CLI (自定义参数)**: 可自定义命令行参数
   - **调试 Codex CLI (安静模式)**: 安静模式调试
   - **附加到运行中的 Codex CLI**: 附加到已运行的进程

### 3. 命令行调试

使用提供的调试脚本：

```bash
# 基本调试模式
./scripts/debug.sh --debug "创建一个 Python hello world"

# Inspector 模式（等待调试器连接）
./scripts/debug.sh --inspect "帮我写个 React 组件"

# 自定义端口
./scripts/debug.sh --debug --port 9230 "修复代码错误"

# 安静模式调试
./scripts/debug.sh --quiet --debug "优化代码性能"

# 查看所有选项
./scripts/debug.sh --help
```

## 调试模式详解

### 开发构建特性

开发构建 (`pnpm run build:dev`) 包含以下特性：

- ✅ **内联 Source Maps**: 堆栈跟踪直接指向原始 TypeScript 代码
- ✅ **未压缩代码**: 便于调试和理解
- ✅ **自动 Source Map 支持**: 自动设置 `NODE_OPTIONS=--enable-source-maps`
- ✅ **调试日志**: 启用 `DEBUG=1` 环境变量

### 调试器配置说明

#### VSCode Launch 配置

```json
{
  "name": "调试 Codex CLI (开发模式)",
  "type": "node", 
  "request": "launch",
  "program": "${workspaceFolder}/dist/cli-dev.js",
  "sourceMaps": true,
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "1"
  }
}
```

#### 命令行调试

```bash
# 基本调试
NODE_OPTIONS="--enable-source-maps --inspect=9229" \
NODE_ENV=development \
DEBUG=1 \
node dist/cli-dev.js "你的提示语"

# Inspector 模式（等待连接）
NODE_OPTIONS="--enable-source-maps --inspect-brk=9229" \
NODE_ENV=development \
DEBUG=1 \
node dist/cli-dev.js "你的提示语"
```

## 调试流程

### 1. 设置断点

在 VSCode 中：
- 直接在 TypeScript 源文件中设置断点
- 支持条件断点和日志断点
- 主要调试入口：
  - `src/cli.tsx`: CLI 主入口
  - `src/app.tsx`: 应用主逻辑
  - `src/utils/`: 工具函数

### 2. 启动调试

**VSCode 方式:**
1. 设置断点
2. 按 `F5` 启动调试
3. 或者在调试面板选择配置后点击运行

**命令行方式:**
1. 启动调试模式：`./scripts/debug.sh --debug "测试命令"`
2. 打开 Chrome，访问 `chrome://inspect`
3. 点击 "Open dedicated DevTools for Node"

### 3. 调试技巧

- **查看变量**: 鼠标悬停或使用变量窗口
- **调用堆栈**: 查看完整的函数调用链
- **控制台执行**: 在暂停时执行表达式
- **监视表达式**: 实时监控变量变化

## 常用调试场景

### 调试命令解析

```typescript
// 在 src/cli.tsx 中设置断点
const cli = meow(/* ... */);
console.log('CLI flags:', cli.flags);
console.log('CLI input:', cli.input);
```

### 调试 AI 交互

```typescript
// 在相关组件中设置断点
// src/components/ 目录下的 React 组件
// src/utils/agent/ 目录下的 Agent 逻辑
```

### 调试文件操作

```typescript
// 在文件操作相关的工具函数中设置断点
// src/utils/ 目录下的各种工具函数
```

## 开发工作流

### Watch 模式开发

```bash
# 启动 TypeScript watch 模式
pnpm run dev
# 或者
./scripts/debug.sh --watch

# 在另一个终端中测试
./scripts/debug.sh "测试命令"
```

### 构建和测试循环

```bash
# 1. 修改代码
# 2. 重新构建
pnpm run build:dev

# 3. 测试
./scripts/debug.sh --quiet "测试场景"

# 4. 重复
```

## 故障排除

### 常见问题

1. **Node.js 版本过低**
   ```
   错误: Codex CLI requires Node.js version 22 or newer
   解决: 升级 Node.js 到 22+ 版本
   ```

2. **Source Maps 不工作**
   ```
   问题: 断点无法命中或显示编译后代码
   解决: 确保使用 build:dev 构建，检查 sourceMaps 配置
   ```

3. **调试器无法附加**
   ```
   问题: Chrome DevTools 无法连接
   解决: 检查端口是否被占用，确认 --inspect 参数正确
   ```

4. **环境变量未生效**
   ```
   问题: DEBUG 日志不显示
   解决: 确认 NODE_ENV=development 和 DEBUG=1 已设置
   ```

### 日志调试

启用详细日志：

```bash
# 启用所有调试日志
DEBUG=* ./scripts/debug.sh "测试命令"

# 启用特定模块日志
DEBUG=codex:* ./scripts/debug.sh "测试命令"

# 检查日志文件
tail -f "$TMPDIR/oai-codex/codex-cli-latest.log"
```

### 清理和重置

```bash
# 清理构建产物
./scripts/debug.sh --clean

# 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 完全重置
git clean -fdx
pnpm install
```

## 性能调试

### CPU 性能分析

```bash
# 启用 CPU 性能分析
NODE_OPTIONS="--enable-source-maps --prof" \
node dist/cli-dev.js "测试命令"

# 生成性能报告
node --prof-process isolate-*.log > performance.txt
```

### 内存分析

```bash
# 启用堆快照
NODE_OPTIONS="--enable-source-maps --inspect" \
node dist/cli-dev.js "测试命令"
# 在 Chrome DevTools 中使用 Memory 标签
```

## 贡献指南

### 调试信息收集

提交 Bug 时请包含：

1. **环境信息**:
   ```bash
   node --version
   pnpm --version
   cat package.json | grep version
   ```

2. **重现步骤**:
   ```bash
   ./scripts/debug.sh --debug "具体命令"
   # 包含详细的操作步骤
   ```

3. **错误日志**:
   ```bash
   # 完整的错误堆栈跟踪
   # 相关的调试日志
   ```

### 代码质量

- 使用 TypeScript 严格模式
- 遵循项目的 ESLint 规则
- 编写单元测试：`pnpm test`
- 运行类型检查：`pnpm run typecheck`

---

## 附录

### 快速命令参考

```bash
# 环境检查
node --version && pnpm --version

# 依赖管理
pnpm install                    # 安装依赖
pnpm run build:dev             # 构建开发版本
pnpm run dev                   # Watch 模式

# 调试启动
./scripts/debug.sh --debug "命令"         # 基本调试
./scripts/debug.sh --inspect "命令"       # Inspector 模式
./scripts/debug.sh --quiet --debug "命令" # 安静模式

# 工具命令
./scripts/debug.sh --clean     # 清理构建
./scripts/debug.sh --build     # 仅构建
./scripts/debug.sh --help      # 查看帮助
```

### 相关文件

- **调试配置**: `.vscode/launch.json`, `.vscode/tasks.json`
- **构建脚本**: `build.mjs`
- **调试脚本**: `scripts/debug.sh`
- **主要源码**: `src/cli.tsx`, `src/app.tsx`
- **测试文件**: `tests/`

### 外部资源

- [Node.js 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [VSCode 调试文档](https://code.visualstudio.com/docs/editor/debugging)
- [Chrome DevTools 文档](https://developer.chrome.com/docs/devtools/)

---

**最后更新**: 2024年5月31日  
**作者**: dailingfei 