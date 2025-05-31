#!/bin/bash

# @Author dailingfei
# Codex CLI 带超时的调试脚本
# 防止API响应超时导致的无限循环

set -e

# 默认超时时间（秒）
DEFAULT_TIMEOUT=120
TIMEOUT=${TIMEOUT:-$DEFAULT_TIMEOUT}

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 显示帮助信息
show_help() {
    cat << EOF
Codex CLI 带超时的调试脚本

用法:
  $0 [选项] [参数...]

选项:
  -h, --help              显示此帮助信息
  -t, --timeout <秒>      设置超时时间 (默认: 120秒)
  -d, --debug             启动调试模式
  -p, --port <port>       指定调试端口 (默认: 9229)
  -q, --quiet             安静模式运行
  -k, --kill              强制杀死现有的 Codex 进程

示例:
  $0 --timeout 60 "创建一个 Python hello world"
  $0 --debug --timeout 180 "帮我写个 React 组件"
  $0 --kill              # 杀死所有 Codex 进程

EOF
}

# 强制杀死 Codex 进程
kill_codex_processes() {
    print_info "查找并终止 Codex 进程..."
    
    # 查找相关进程
    local pids=$(ps aux | grep -E "(codex|cli-dev)" | grep -v grep | awk '{print $2}')
    
    if [ -z "$pids" ]; then
        print_info "没有找到运行中的 Codex 进程"
        return 0
    fi
    
    print_warning "找到 Codex 进程: $pids"
    
    # 首先尝试优雅关闭
    for pid in $pids; do
        print_info "尝试优雅关闭进程 $pid..."
        kill -TERM $pid 2>/dev/null || true
    done
    
    # 等待一段时间
    sleep 3
    
    # 检查是否还有进程存在，强制杀死
    local remaining_pids=$(ps aux | grep -E "(codex|cli-dev)" | grep -v grep | awk '{print $2}')
    if [ ! -z "$remaining_pids" ]; then
        print_warning "强制杀死残余进程: $remaining_pids"
        for pid in $remaining_pids; do
            kill -KILL $pid 2>/dev/null || true
        done
    fi
    
    print_success "Codex 进程清理完成"
}

# 带超时运行命令
run_with_timeout() {
    local timeout_duration=$1
    shift
    local cmd="$@"
    
    print_info "启动命令 (超时: ${timeout_duration}秒): $cmd"
    print_info "提示: 如果超时，进程将被自动终止"
    
    # 在后台启动命令
    eval "$cmd" &
    local cmd_pid=$!
    
    # 启动超时计时器
    (
        sleep $timeout_duration
        if kill -0 $cmd_pid 2>/dev/null; then
            print_error "命令执行超时 (${timeout_duration}秒)，正在终止进程..."
            kill -TERM $cmd_pid 2>/dev/null || true
            sleep 2
            if kill -0 $cmd_pid 2>/dev/null; then
                kill -KILL $cmd_pid 2>/dev/null || true
            fi
        fi
    ) &
    local timeout_pid=$!
    
    # 等待命令完成或超时
    local exit_code=0
    if wait $cmd_pid 2>/dev/null; then
        # 命令正常完成，杀死超时计时器
        kill $timeout_pid 2>/dev/null || true
        print_success "命令执行完成"
    else
        exit_code=$?
        kill $timeout_pid 2>/dev/null || true
        if [ $exit_code -eq 143 ] || [ $exit_code -eq 137 ]; then
            print_error "命令因超时被终止"
            exit_code=124  # 标准超时退出码
        else
            print_error "命令执行失败，退出码: $exit_code"
        fi
    fi
    
    return $exit_code
}

# 主函数
main() {
    local debug_mode=false
    local debug_port=9229
    local quiet_mode=false
    local kill_only=false
    local timeout=$DEFAULT_TIMEOUT
    local args=()

    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -t|--timeout)
                timeout="$2"
                shift 2
                ;;
            -d|--debug)
                debug_mode=true
                shift
                ;;
            -p|--port)
                debug_port="$2"
                shift 2
                ;;
            -q|--quiet)
                quiet_mode=true
                shift
                ;;
            -k|--kill)
                kill_only=true
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

    # 如果只是要杀死进程
    if [ "$kill_only" = true ]; then
        kill_codex_processes
        exit 0
    fi

    # 清理现有进程
    kill_codex_processes

    # 检查参数
    if [ ${#args[@]} -eq 0 ]; then
        print_error "请提供要执行的命令参数"
        show_help
        exit 1
    fi

    # 构建命令
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local base_cmd="$script_dir/debug.sh"
    
    if [ "$debug_mode" = true ]; then
        base_cmd="$base_cmd --debug --port $debug_port"
    fi
    
    if [ "$quiet_mode" = true ]; then
        base_cmd="$base_cmd --quiet"
    fi
    
    base_cmd="$base_cmd ${args[*]}"

    # 运行命令
    if run_with_timeout $timeout "$base_cmd"; then
        print_success "调试会话正常结束"
    else
        local exit_code=$?
        if [ $exit_code -eq 124 ]; then
            print_error "调试会话超时终止"
            print_info "建议："
            print_info "  1. 检查网络连接"
            print_info "  2. 检查 API 配置"
            print_info "  3. 使用更短的命令进行测试"
            print_info "  4. 增加超时时间: --timeout 300"
        else
            print_error "调试会话异常终止"
        fi
        exit $exit_code
    fi
}

# 执行主函数
main "$@" 