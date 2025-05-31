# 代理配置指南

## 概述

本文档详细说明如何为 Codex CLI 配置网络代理，解决在受限网络环境中访问 OpenAI API 的问题。

## 支持的代理类型

### HTTP/HTTPS 代理
- 适用于大多数企业网络环境
- 支持基本认证和无认证模式

### SOCKS5 代理  
- 适用于需要更高级代理功能的场景
- 支持 TCP 和 UDP 流量

## 环境变量配置

### 优先级顺序

Codex CLI 按以下优先级检查代理环境变量：

1. `HTTPS_PROXY` - 标准 HTTPS 代理设置
2. `https_proxy` - 小写版本（Linux/Unix 常用）
3. `HTTP_PROXY` - 标准 HTTP 代理设置  
4. `http_proxy` - 小写版本（Linux/Unix 常用）
5. `ALL_PROXY` - 通用代理设置
6. `all_proxy` - 小写版本（Linux/Unix 常用）

### 配置示例

#### 1. HTTP 代理（推荐）

```bash
# 方法1: 设置 HTTPS_PROXY
export HTTPS_PROXY=http://127.0.0.1:7890

# 方法2: 设置 https_proxy（Linux/Unix 推荐）
export https_proxy=http://127.0.0.1:7890

# 方法3: 同时设置多个（最兼容）
export HTTPS_PROXY=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```

#### 2. 带认证的 HTTP 代理

```bash
export HTTPS_PROXY=http://username:password@proxy.company.com:8080
export https_proxy=http://username:password@proxy.company.com:8080
```

#### 3. SOCKS5 代理

```bash
export ALL_PROXY=socks5://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

#### 4. 企业环境配置

```bash
# 企业代理服务器
export HTTPS_PROXY=http://proxy.company.com:8080
export HTTP_PROXY=http://proxy.company.com:8080

# 绕过内网地址
export NO_PROXY=localhost,127.0.0.1,*.company.com
export no_proxy=localhost,127.0.0.1,*.company.com
```

## 验证代理配置

### 1. 检查环境变量

```bash
echo "HTTPS_PROXY: ${HTTPS_PROXY:-未设置}"
echo "https_proxy: ${https_proxy:-未设置}"
echo "HTTP_PROXY: ${HTTP_PROXY:-未设置}"
echo "http_proxy: ${http_proxy:-未设置}"
echo "ALL_PROXY: ${ALL_PROXY:-未设置}"
echo "all_proxy: ${all_proxy:-未设置}"
```

### 2. 运行代理测试脚本

```bash
# 运行专门的代理配置测试
node test-proxy-config.js
```

### 3. 启用调试日志

```bash
# 设置调试模式
export DEBUG=1

# 运行 Codex CLI
node bin/codex.js "test message"
```

在调试日志中查找以下信息：
- `代理配置检测: 使用环境变量 xxx=xxx`
- `代理配置: 已启用代理 xxx`
- `代理配置: HttpsProxyAgent 已创建`

## 常见问题排查

### 1. 代理连接超时

**症状**: `stream = await responseCall(requestParams)` 一直阻塞

**可能原因**:
- 代理服务器地址或端口错误
- 代理服务器未运行
- 防火墙阻止连接

**解决方法**:
```bash
# 1. 验证代理服务器是否可达
curl -x http://127.0.0.1:7890 https://api.openai.com/v1/models

# 2. 检查代理服务器状态
netstat -an | grep 7890

# 3. 测试直接连接（临时禁用代理）
unset HTTPS_PROXY https_proxy HTTP_PROXY http_proxy ALL_PROXY all_proxy
```

### 2. 代理认证失败

**症状**: 401 Unauthorized 错误

**解决方法**:
```bash
# 确保用户名和密码正确编码
export HTTPS_PROXY=http://$(echo -n 'username:password' | base64)@proxy.company.com:8080

# 或者使用 URL 编码
export HTTPS_PROXY=http://username%40domain:password@proxy.company.com:8080
```

### 3. SOCKS5 代理问题

**症状**: 连接被拒绝

**解决方法**:
```bash
# 确保使用正确的 SOCKS5 协议前缀
export ALL_PROXY=socks5://127.0.0.1:7890

# 不要使用 socks5h:// 除非代理支持远程 DNS 解析
```

### 4. 企业网络证书问题

**症状**: SSL/TLS 证书验证失败

**解决方法**:
```bash
# 临时禁用证书验证（仅用于测试）
export NODE_TLS_REJECT_UNAUTHORIZED=0

# 或者配置企业 CA 证书
export NODE_EXTRA_CA_CERTS=/path/to/company-ca.pem
```

## 性能优化

### 1. 连接池配置

```bash
# 增加连接超时时间
export OPENAI_TIMEOUT_MS=60000

# 配置 HTTP Agent 选项
export NODE_OPTIONS="--max-http-header-size=16384"
```

### 2. 代理服务器选择

- 选择地理位置较近的代理服务器
- 使用支持 HTTP/2 的代理服务器
- 避免多层代理转发

## 测试工具

### 1. 基本连接测试

```bash
# 测试代理连接
curl -x $HTTPS_PROXY https://api.openai.com/v1/models

# 测试 DNS 解析
nslookup api.openai.com
```

### 2. 代理配置测试脚本

```bash
# 运行完整的代理配置测试
node test-proxy-config.js

# 运行带代理的调试测试
node test-debug.js
```

### 3. 网络诊断

```bash
# 检查路由
traceroute api.openai.com

# 检查端口连通性
telnet 127.0.0.1 7890

# 检查代理日志
tail -f /var/log/proxy.log
```

## 最佳实践

### 1. 环境变量管理

```bash
# 创建代理配置文件
cat > ~/.proxy_config << EOF
export HTTPS_PROXY=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
EOF

# 在 shell 配置文件中引用
echo "source ~/.proxy_config" >> ~/.bashrc
```

### 2. 条件代理配置

```bash
# 根据网络环境自动配置代理
if ping -c 1 api.openai.com >/dev/null 2>&1; then
    echo "直接连接可用"
    unset HTTPS_PROXY https_proxy
else
    echo "启用代理连接"
    export HTTPS_PROXY=http://127.0.0.1:7890
    export https_proxy=http://127.0.0.1:7890
fi
```

### 3. 安全考虑

- 避免在命令行历史中暴露代理密码
- 使用环境变量文件管理敏感信息
- 定期更新代理服务器配置
- 监控代理连接日志

## 作者

@Author dailingfei

## 更新日志

- 2025-01-01: 初始版本，支持多种代理环境变量检测
- 2025-01-01: 添加详细的调试日志和测试脚本 