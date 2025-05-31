#!/usr/bin/env node

/**
 * @Author dailingfei
 * 代理配置测试脚本 - 验证代理设置是否正确工作
 */

// 设置调试模式
process.env.DEBUG = '1';

// 测试不同的代理配置
const testProxyConfigs = [{
        name: '测试1: HTTPS_PROXY',
        env: { HTTPS_PROXY: 'http://127.0.0.1:7890' }
    },
    {
        name: '测试2: https_proxy (小写)',
        env: { https_proxy: 'http://127.0.0.1:7890' }
    },
    {
        name: '测试3: HTTP_PROXY',
        env: { HTTP_PROXY: 'http://127.0.0.1:7890' }
    },
    {
        name: '测试4: ALL_PROXY',
        env: { ALL_PROXY: 'socks5://127.0.0.1:7890' }
    },
    {
        name: '测试5: 无代理配置',
        env: {}
    }
];

async function testProxyConfig(config) {
    console.log(`\n========== ${config.name} ==========`);

    // 清除所有代理环境变量
    const proxyVars = ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy', 'ALL_PROXY', 'all_proxy'];
    proxyVars.forEach(varName => {
        delete process.env[varName];
    });

    // 设置测试环境变量
    Object.assign(process.env, config.env);

    // 打印当前环境变量状态
    console.log('当前代理环境变量:');
    proxyVars.forEach(varName => {
        const value = process.env[varName];
        console.log(`  ${varName}: ${value || '未设置'}`);
    });

    try {
        // 直接从源代码导入 AgentLoop (TypeScript)
        const { AgentLoop } = await
        import ('./src/utils/agent/agent-loop.ts');

        // 创建 AgentLoop 实例（仅测试初始化，不实际运行）
        const agentLoop = new AgentLoop({
            model: 'gpt-4.1',
            provider: 'openai',
            approvalPolicy: 'suggest',
            onItem: () => {},
            onLoading: () => {},
            getCommandConfirmation: async() => ({ review: 'approve' }),
            onLastResponseId: () => {},
            additionalWritableRoots: [],
            config: {
                apiKey: 'test-key', // 使用测试密钥，不会实际调用API
                model: 'gpt-4.1'
            }
        });

        console.log('✅ AgentLoop 初始化成功');

        // 清理
        agentLoop.terminate();

    } catch (error) {
        console.error('❌ AgentLoop 初始化失败:', error.message);
    }
}

async function runAllTests() {
    console.log('开始代理配置测试...\n');

    for (const config of testProxyConfigs) {
        await testProxyConfig(config);

        // 等待一下，让日志输出完整
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n========== 测试完成 ==========');
    console.log('\n建议的代理配置方法:');
    console.log('1. 设置环境变量: export https_proxy=http://127.0.0.1:7890');
    console.log('2. 或者设置: export HTTPS_PROXY=http://127.0.0.1:7890');
    console.log('3. 对于 SOCKS5 代理: export ALL_PROXY=socks5://127.0.0.1:7890');
    console.log('4. 验证设置: echo $https_proxy');
}

// 运行测试
runAllTests().catch(console.error);