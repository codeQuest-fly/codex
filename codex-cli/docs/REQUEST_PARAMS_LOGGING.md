# 请求参数打印功能实现

## 概述

在 `agent-loop.ts` 中添加了完整的外部 API 请求参数打印功能，用于调试和监控 OpenAI API 调用。

## 实现位置

文件：`src/utils/agent/agent-loop.ts`
位置：第 847-861 行（在 `responseCall` 调用之前）

## 功能特性

### 打印的参数包括：

1. **基本配置参数**：
   - `model`: 使用的模型名称
   - `stream`: 是否使用流式响应
   - `parallel_tool_calls`: 是否并行调用工具
   - `tool_choice`: 工具选择策略

2. **存储和上下文参数**：
   - `store`: 是否在服务器端存储响应
   - `previous_response_id`: 上一个响应的ID
   - `service_tier`: 服务层级（如 "flex"）

3. **推理参数**：
   - `reasoning`: 推理配置

4. **工具配置**：
   - `tools count`: 可用工具数量
   - `tools`: 完整的工具定义（JSON格式）

5. **指令和输入**：
   - `instructions length`: 指令文本长度
   - `instructions`: 指令文本（前500字符）
   - `input count`: 输入项数量
   - `input`: 完整的输入内容（JSON格式）

## 日志格式

```
[2025-05-31T21:58:14] AgentLoop.run(): ========== 完整请求参数 ==========
[2025-05-31T21:58:14] AgentLoop.run(): model: gpt-4.1
[2025-05-31T21:58:14] AgentLoop.run(): stream: true
[2025-05-31T21:58:14] AgentLoop.run(): parallel_tool_calls: false
[2025-05-31T21:58:14] AgentLoop.run(): tool_choice: auto
[2025-05-31T21:58:14] AgentLoop.run(): store: true
[2025-05-31T21:58:14] AgentLoop.run(): previous_response_id: undefined
[2025-05-31T21:58:14] AgentLoop.run(): service_tier: undefined
[2025-05-31T21:58:14] AgentLoop.run(): reasoning: undefined
[2025-05-31T21:58:14] AgentLoop.run(): tools count: 1
[2025-05-31T21:58:14] AgentLoop.run(): tools: [...]
[2025-05-31T21:58:14] AgentLoop.run(): instructions length: 8289
[2025-05-31T21:58:14] AgentLoop.run(): instructions (前500字符): ...
[2025-05-31T21:58:14] AgentLoop.run(): input count: 1
[2025-05-31T21:58:14] AgentLoop.run(): input: [...]
[2025-05-31T21:58:14] AgentLoop.run(): ========== 请求参数结束 ==========
```

## 启用方法

1. 设置环境变量：`export DEBUG=1`
2. 设置代理（如需要）：
   ```bash
   export https_proxy=http://127.0.0.1:7890
   export http_proxy=http://127.0.0.1:7890
   export all_proxy=socks5://127.0.0.1:7890
   ```
3. 运行 codex：`node bin/codex.js "your message"`

## 日志文件位置

- macOS: `$TMPDIR/oai-codex/codex-cli-latest.log`
- Linux: `~/.local/oai-codex/codex-cli-latest.log`

## 构建说明

- 开发版本：`CODEX_DEV=1 npm run build` → `dist/cli-dev.js`
- 生产版本：`npm run build` → `dist/cli.js`

注意：由于生产版本会进行代码压缩，中文日志可能不会出现在压缩后的代码中。建议在开发环境中使用此功能进行调试。

## 技术细节

- 使用 `log()` 函数记录日志，只有在 `DEBUG=1` 时才会输出
- 对长文本（如 instructions）进行截断显示，避免日志过长
- 使用 `JSON.stringify()` 格式化复杂对象，便于阅读
- 在实际 API 调用之前打印，确保能捕获到所有参数

## 作者

@Author dailingfei 