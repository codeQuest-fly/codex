#!/usr/bin/env node

/**
 * @Author dailingfei
 * 直接测试 AgentLoop 的调试脚本
 */

// 从构建文件中导入，需要找到正确的导出
import ('./dist/cli.js').then(async(module) => {
    console.log('模块导出:', Object.keys(module));

    // 查找 AgentLoop 类（可能被压缩为其他名称）
    const AgentLoopClass = Object.values(module).find(
        (value) => typeof value === 'function' && value.name && value.name.includes('AgentLoop') || value.toString().includes('AgentLoop')
    );

    if (!AgentLoopClass) {
        console.error('未找到 AgentLoop 类');
        return;
    }

    console.log('找到 AgentLoop 类:', AgentLoopClass.name);
    await runTest(AgentLoopClass);
}).catch(console.error);

async function runTest(AgentLoop) {
    console.log('开始 AgentLoop 调试测试...');

    // 模拟配置
    const config = {
        model: 'gpt-4.1',
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY || 'test-key'
    };

    // 创建 AgentLoop 实例
    const agentLoop = new AgentLoop({
        model: config.model,
        provider: config.provider,
        config: config,
        approvalPolicy: 'suggest',
        additionalWritableRoots: [],
        onItem: (item) => {
            console.log('收到项目:', item.type, item.role || '');
        },
        onLoading: (loading) => {
            console.log('加载状态:', loading);
        },
        getCommandConfirmation: async() => ({
            review: 'approve'
        }),
        onLastResponseId: (id) => {
            console.log('最后响应ID:', id);
        }
    });

    // 测试输入
    const testInput = [{
        type: 'message',
        role: 'user',
        content: [{
            type: 'input_text',
            text: 'hello'
        }]
    }];

    console.log('开始运行 AgentLoop...');

    // 设置超时
    const timeout = setTimeout(() => {
        console.log('测试超时，终止 AgentLoop...');
        agentLoop.terminate();
        process.exit(0);
    }, 15000); // 15秒超时

    try {
        await agentLoop.run(testInput);
        console.log('AgentLoop 运行完成');
    } catch (error) {
        console.error('AgentLoop 运行出错:', error);
    } finally {
        clearTimeout(timeout);
        agentLoop.terminate();
    }
}