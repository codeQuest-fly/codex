#!/usr/bin/env node

/**
 * @Author dailingfei
 * 调试测试脚本 - 用于验证 AgentLoop 的调试日志
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

console.log('开始调试测试...');

// 运行 codex 命令并捕获输出
const codexPath = path.join(__dirname, 'bin', 'codex.js');
const child = spawn('node', [codexPath, 'hello'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
        ...process.env,
        DEBUG: '1' // 启用调试模式
    }
});

let output = '';
let errorOutput = '';

child.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log('STDOUT:', text);
});

child.stderr.on('data', (data) => {
    const text = data.toString();
    errorOutput += text;
    console.log('STDERR:', text);
});

child.on('close', (code) => {
    console.log(`\n=== 测试完成 ===`);
    console.log(`退出码: ${code}`);
    console.log(`输出长度: ${output.length}`);
    console.log(`错误输出长度: ${errorOutput.length}`);

    // 检查是否包含我们添加的调试日志
    const debugLogs = [
        '准备调用 OpenAI API',
        'turnInput length=',
        '开始调用 responseCall',
        'responseCall 完成',
        '开始处理流响应事件',
        '开始迭代流事件'
    ];

    console.log('\n=== 调试日志检查 ===');
    debugLogs.forEach(log => {
        const found = output.includes(log) || errorOutput.includes(log);
        console.log(`${found ? '✓' : '✗'} ${log}: ${found ? '找到' : '未找到'}`);
    });
});

// 10秒后强制结束
setTimeout(() => {
    console.log('\n超时，强制结束进程...');
    child.kill('SIGTERM');
}, 10000);