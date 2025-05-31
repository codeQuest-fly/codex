#!/bin/bash

# @Author dailingfei
# Codex CLI 调试脚本
# 提供多种调试模式的便捷启动方式

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Node.js版本
check_node_version() {
    local node_version=$(node --version | sed 's/v//')
    local major_version=$(echo $node_version | cut -d. -f1)
    
    if [ "$major_version" -lt 22 ]; then
        print_error "需要 Node.js >= 22, 当前版本: $node_version"
        exit 1
    fi
    
    print_success "Node.js 版本检查通过: $node_version"
}

# 构建开发版本
build_dev() {
    print_info "构建开发版本..."
    cd "$PROJECT_DIR"
    
    if ! pnpm run build:dev >/dev/null 2>&1; then
        print_error "构建失败"
        exit 1
    fi
    
    print_success "构建完成: dist/cli-dev.js"
}

# 显示帮助信息
show_help() {
    cat << EOF
Codex CLI 调试脚本

用法:
  $0 [选项] [参数...]

选项:
  -h, --help              显示此帮助信息
  -d, --debug             启动调试模式 (默认端口: 9229)
  -p, --port <port>       指定调试端口 (默认: 9229)
  -b, --build             仅构建，不运行
  -w, --watch             启动 watch 模式
  -q, --quiet             安静模式运行
  -i, --inspect          启动 Inspector 模式
  -c, --clean             清理构建产物

示例:
  $0 "创建一个 Python hello world"
  $0 --debug "帮我写个 React 组件" 
  $0 --quiet --port 9230 "修复代码错误"
  $0 --watch

EOF
}

# 主函数
main() {
    local debug_mode=false
    local debug_port=9229
    local build_only=false
    local watch_mode=false
    local quiet_mode=false
    local inspect_mode=false
    local clean_only=false
    local args=()

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--debug)
                debug_mode=true
                shift
                ;;
            -p|--port)
                debug_port="$2"
                shift 2
                ;;
            -b|--build)
                build_only=true
                shift
                ;;
            -w|--watch)
                watch_mode=true
                shift
                ;;
            -q|--quiet)
                quiet_mode=true
                shift
                ;;
            -i|--inspect)
                inspect_mode=true
                shift
                ;;
            -c|--clean)
                clean_only=true
                shift
                ;;
            -*)
                print_error "未知选项: $1"
                show_help
                exit 1
                ;;
            *)
                args+=("$1")
                shift
                ;;
        esac
    done

    cd "$PROJECT_DIR"

    # 清理模式
    if [ "$clean_only" = true ]; then
        print_info "清理构建产物..."
        rm -rf dist
        print_success "清理完成"
        exit 0
    fi

    # 检查环境
    check_node_version

    # Watch 模式
    if [ "$watch_mode" = true ]; then
        print_info "启动 TypeScript watch 模式..."
        pnpm run dev
        exit 0
    fi

    # 构建
    build_dev

    # 仅构建模式
    if [ "$build_only" = true ]; then
        print_success "构建完成，退出"
        exit 0
    fi

    # 准备运行参数
    local node_options="--enable-source-maps"
    local cli_args=()

    if [ "$debug_mode" = true ]; then
        node_options="$node_options --inspect=0.0.0.0:$debug_port"
        print_info "启动调试模式，端口: $debug_port"
        print_info "在 Chrome 中打开: chrome://inspect"
    fi

    if [ "$inspect_mode" = true ]; then
        node_options="$node_options --inspect-brk=0.0.0.0:$debug_port"
        print_info "启动 Inspector 模式 (等待调试器连接)，端口: $debug_port"
    fi

    if [ "$quiet_mode" = true ]; then
        cli_args+=("--quiet")
    fi

    # 添加用户参数
    cli_args+=("${args[@]}")

    # 运行 CLI
    print_info "启动 Codex CLI..."
    print_info "命令: NODE_OPTIONS=\"$node_options\" node dist/cli-dev.js ${cli_args[*]}"
    
    export NODE_OPTIONS="$node_options"
    export NODE_ENV="development"
    export DEBUG="1"
    
    exec node dist/cli-dev.js "${cli_args[@]}"
}

# 执行主函数
main "$@" 