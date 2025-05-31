# Cursor 调试 Codex CLI TypeScript 代码指南

## 🎯 概述

本指南详细介绍如何在 Cursor 中调试 Codex CLI 的 TypeScript 代码，基于 Cursor 与 VS Code 内核的兼容性，提供完整的调试解决方案。

## 🚀 快速开始

### 1. 环境检查

```bash
# 检查必要的工具版本
node --version    # >= 22.0.0
pnpm --version    # 任意版本
```

### 2. 一键调试

在 Cursor 中：
1. 打开 `codex-cli` 目录
2. 按 `F5` 启动调试
3. 选择调试配置（推荐：`🐛 调试 Codex CLI (开发模式)`）

## 📋 调试配置详解

我们提供了 6 种调试模式：

| 图标 | 配置名称 | 适用场景 | 特点 |
|------|----------|----------|------|
| 🐛 | 调试 Codex CLI (开发模式) | 日常开发调试 | 预设提示语，自动构建 |
| 🔧 | 调试 Codex CLI (自定义参数) | 自定义测试场景 | 可手动输入参数 |
| 🤫 | 调试 Codex CLI (安静模式) | 测试安静模式 | 无交互式UI |
| ⚡ | 调试 Codex CLI (ts-node) | 快速调试 | 直接运行TS，无需编译 |
| 🔗 | 附加到运行中的进程 | 调试已运行的CLI | 附加调试模式 |
| 🧪 | 调试单元测试 | 测试调试 | Vitest 测试调试 |

## 🔧 Source Maps 配置

### TypeScript 配置

我们的 `tsconfig.json` 已优化：

```json
{
  "compilerOptions": {
    "sourceMap": true,           // ✅ 生成独立的 .map 文件
    "inlineSourceMap": false,    // ✅ 避免内联映射问题
    "inlineSources": false,      // ✅ 独立的源码映射
    "outDir": "dist"             // ✅ 编译输出目录
  }
}
```

### 调试器路径映射

```json
{
  "sourceMapPathOverrides": {
    "${workspaceFolder}/dist/*": "${workspaceFolder}/src/*"
  }
}
```

这确保调试器能正确映射 `dist/` 中的编译文件到 `src/` 中的源码。

## 🎪 调试操作指南

### 设置断点

1. **行断点**：在代码行号左侧点击红点
2. **条件断点**：右键选择"条件断点"
3. **日志断点**：右键选择"日志断点"
4. **代码断点**：在代码中写 `debugger;`

### 调试控制

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `F5` | 继续/启动 | 运行到下一个断点 |
| `F10` | 单步跳过 | 执行当前行，不进入函数 |
| `F11` | 单步进入 | 进入函数内部 |
| `Shift+F11` | 单步跳出 | 跳出当前函数 |
| `Ctrl+Shift+F5` | 重启调试 | 重新启动调试会话 |

### 查看调试信息

- **变量面板**：查看当前作用域内的所有变量
- **监视面板**：添加表达式实时监控
- **调用堆栈**：查看函数调用链
- **断点面板**：管理所有断点

## 🚀 调试模式详细说明

### 🐛 开发模式（推荐）

```json
{
  "name": "🐛 调试 Codex CLI (开发模式)",
  "type": "pwa-node",
  "preLaunchTask": "build-dev",
  "args": ["你好，请帮我创建一个简单的hello world程序"]
}
```

- **优点**：完整的构建流程，Source Maps 支持最佳
- **适用**：日常开发调试
- **使用**：直接按 F5 启动

### ⚡ ts-node 模式（快速）

```json
{
  "name": "⚡ 调试 Codex CLI (ts-node 直接运行)",
  "runtimeArgs": ["-r", "ts-node/register"],
  "args": ["${workspaceFolder}/src/cli.tsx"]
}
```

- **优点**：无需编译，快速启动
- **缺点**：某些情况下类型检查可能不完整
- **适用**：快速原型验证

### 🔗 附加模式（高级）

```bash
# 先用命令行启动调试模式
./scripts/debug.sh --debug "测试命令"

# 然后在 Cursor 中选择"附加"配置
```

- **优点**：可以调试已运行的进程
- **适用**：调试复杂的运行环境

## 🔍 常见调试场景

### 1. 调试命令解析

在 `src/cli.tsx` 中设置断点：

```typescript
const cli = meow(/* ... */);
// 🔴 在这里设置断点
console.log('CLI flags:', cli.flags);
console.log('CLI input:', cli.input);
```

### 2. 调试 React 组件

在 `src/components/` 中的组件：

```typescript
export default function TerminalChat({ config }: Props) {
  // 🔴 设置断点查看 props
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // 🔴 设置断点查看副作用
    console.log('Component mounted with config:', config);
  }, [config]);
}
```

### 3. 调试 Agent 逻辑

在 `src/utils/agent/` 中：

```typescript
export class AgentLoop {
  async processRequest(input: string) {
    // 🔴 设置断点查看请求处理
    const response = await this.callAI(input);
    return response;
  }
}
```

### 4. 调试异步操作

使用条件断点：

```typescript
async function fetchData() {
  const response = await fetch(url);
  // 🔴 条件断点：response.status !== 200
  if (!response.ok) {
    throw new Error('Fetch failed');
  }
}
```

## 🛠️ 故障排除

### 断点不生效

1. **检查 Source Maps**：
   ```bash
   # 确保编译生成了 .map 文件
   ls -la dist/*.map
   ```

2. **验证路径映射**：
   ```json
   "sourceMapPathOverrides": {
     "${workspaceFolder}/dist/*": "${workspaceFolder}/src/*"
   }
   ```

3. **重新构建**：
   ```bash
   pnpm run build:dev
   ```

### 变量显示异常

1. **使用 pwa-node 类型**：
   ```json
   {
     "type": "pwa-node",  // 而不是 "node"
     "protocol": "inspector"
   }
   ```

2. **检查 Node.js 版本**：
   确保使用 Node.js >= 22

### ts-node 模式问题

1. **安装 ts-node**：
   ```bash
   pnpm add -D ts-node
   ```

2. **配置环境变量**：
   ```json
   {
     "env": {
       "TS_NODE_PROJECT": "tsconfig.json"
     }
   }
   ```

## 🎨 Cursor 特有功能

### AI 辅助调试

1. **代码解释**：选中代码片段，使用 Cursor 的 AI 功能解释代码逻辑
2. **错误分析**：当遇到错误时，可以让 AI 分析错误原因
3. **调试策略**：询问 AI 如何设置断点和调试策略

### 智能断点建议

Cursor 可能会基于代码分析建议断点位置：
- 函数入口点
- 错误处理位置
- 异步操作完成点

## 🚀 高级调试技巧

### 1. 多进程调试

如果 CLI 创建了子进程：

```json
{
  "processId": "${command:PickProcess}",
  "skipFiles": ["<node_internals>/**"]
}
```

### 2. 性能调试

启用 CPU 分析：

```bash
NODE_OPTIONS="--prof --enable-source-maps" node dist/cli-dev.js
```

### 3. 内存调试

使用 Chrome DevTools：

```bash
NODE_OPTIONS="--inspect --enable-source-maps" node dist/cli-dev.js
# 打开 chrome://inspect
```

## 📊 调试最佳实践

### 1. 断点策略

- **入口断点**：在函数入口设置断点了解参数
- **返回断点**：在函数返回前设置断点查看结果
- **错误断点**：在 catch 块中设置断点

### 2. 日志调试

结合断点和日志：

```typescript
function processData(data: any) {
  console.log('Input data:', data);  // 日志
  // 🔴 断点：检查数据结构
  const result = transform(data);
  console.log('Result:', result);    // 日志
  return result;
}
```

### 3. 监视表达式

在监视面板添加：
- `this`：查看类实例状态
- `process.env`：查看环境变量
- `config`：查看配置对象

## 🔄 调试工作流

1. **编辑代码** → 保存文件
2. **设置断点** → 在关键位置
3. **启动调试** → F5 选择配置
4. **单步执行** → F10/F11 逐步调试
5. **查看状态** → 变量/监视/调用栈
6. **修复问题** → 停止调试，修改代码
7. **重新测试** → 重启调试验证修复

## 📚 快速命令参考

```bash
# 构建调试版本
pnpm run build:dev

# 启动 TypeScript watch 模式
pnpm run dev

# 使用超时调试脚本
./scripts/debug-with-timeout.sh --debug "测试命令"

# 查看调试日志
tail -f "$TMPDIR/oai-codex/codex-cli-latest.log"

# 清理进程
./scripts/debug-with-timeout.sh --kill
```

## 🎯 总结

- **准备**：确保 Source Maps 正确配置
- **选择**：根据场景选择合适的调试模式
- **操作**：熟练使用断点和调试控制
- **排障**：了解常见问题的解决方法
- **提升**：利用 Cursor 的 AI 功能增强调试体验

在 Cursor 中调试 TypeScript 的体验与 VS Code 几乎一致，加上 AI 辅助功能，可以让调试过程更加高效和智能！

---

**作者**: dailingfei  
**更新**: 2024年5月31日 