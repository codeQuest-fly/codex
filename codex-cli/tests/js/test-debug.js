#!/usr/bin/env node

/**
 * @Author dailingfei
 * 测试脚本 - 验证 AgentLoop 中的请求参数打印功能
 */

// 设置环境变量
process.env.DEBUG = '1';

// 设置代理环境变量 - 使用多种格式确保兼容性
process.env.HTTPS_PROXY = 'http://127.0.0.1:7890';
process.env.https_proxy = 'http://127.0.0.1:7890';
process.env.HTTP_PROXY = 'http://127.0.0.1:7890';
process.env.http_proxy = 'http://127.0.0.1:7890';
process.env.ALL_PROXY = 'socks5://127.0.0.1:7890';
process.env.all_proxy = 'socks5://127.0.0.1:7890';

console.log('代理环境变量设置:');
console.log(`HTTPS_PROXY: ${process.env.HTTPS_PROXY}`);
console.log(`https_proxy: ${process.env.https_proxy}`);
console.log(`HTTP_PROXY: ${process.env.HTTP_PROXY}`);
console.log(`http_proxy: ${process.env.http_proxy}`);
console.log(`ALL_PROXY: ${process.env.ALL_PROXY}`);
console.log(`all_proxy: ${process.env.all_proxy}`);

// 导入必要的模块
import { AgentLoop } from './dist/utils/agent/agent-loop.js';

async function testRequestParameterLogging() {
    console.log('开始测试请求参数打印功能...');

    // 创建 AgentLoop 实例
    const agentLoop = new AgentLoop({
        model: 'gpt-4.1',
        provider: 'openai',
        approvalPolicy: 'suggest',
        onItem: (item) => {
            console.log('收到响应项:', item.type);
        },
        onLoading: (loading) => {
            console.log('加载状态:', loading);
        },
        getCommandConfirmation: async() => ({ review: 'approve' }),
        onLastResponseId: (id) => {
            console.log('最后响应ID:', id);
        },
        additionalWritableRoots: [],
        config: {
            apiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-4.1'
        }
    });

    // 准备测试输入
    const testInput = [{
        type: 'message',
        role: 'user',
        content: [{
            type: 'input_text',
            text: 'Hello, this is a test message for parameter logging.'
        }]
    }];

    try {
        console.log('开始运行 AgentLoop...');

        // 设置超时
        const timeout = setTimeout(() => {
            console.log('测试超时，终止 AgentLoop...');
            agentLoop.terminate();
        }, 30000); // 30秒超时

        await agentLoop.run(testInput);
        clearTimeout(timeout);

        console.log('AgentLoop 运行完成');
    } catch (error) {
        console.error('AgentLoop 运行出错:', error);
    } finally {
        agentLoop.terminate();
    }
}

// 运行测试
testRequestParameterLogging().catch(console.error);