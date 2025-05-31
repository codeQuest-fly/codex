#!/usr/bin/env node

/**
 * @Author dailingfei
 * 简单的代理配置测试 - 直接测试代理检测逻辑
 */

// 设置调试模式
process.env.DEBUG = '1';

// 模拟代理检测函数（从 agent-loop.ts 复制）
function getProxyUrl() {
    // Check various proxy environment variables in order of preference
    const proxyVars = [
        'HTTPS_PROXY',
        'https_proxy',
        'HTTP_PROXY',
        'http_proxy',
        'ALL_PROXY',
        'all_proxy'
    ];

    for (const varName of proxyVars) {
        const value = process.env[varName];
        if (value) {
            console.log(`代理配置检测: 使用环境变量 ${varName}=${value}`);
            return value;
        }
    }

    console.log('代理配置检测: 未找到任何代理环境变量');
    return undefined;
}

// 测试不同的代理配置
const testConfigs = [{
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
        name: '测试5: 多个代理变量（优先级测试）',
        env: {
            http_proxy: 'http://127.0.0.1:8080',
            HTTPS_PROXY: 'http://127.0.0.1:7890',
            ALL_PROXY: 'socks5://127.0.0.1:1080'
        }
    },
    {
        name: '测试6: 无代理配置',
        env: {}
    }
];

function testProxyDetection(config) {
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

    // 测试代理检测逻辑
    console.log('\n代理检测结果:');
    const detectedProxy = getProxyUrl();

    if (detectedProxy) {
        console.log(`✅ 检测到代理: ${detectedProxy}`);

        // 测试 HttpsProxyAgent 创建
        try {
            const { HttpsProxyAgent } = require('https-proxy-agent');
            const agent = new HttpsProxyAgent(detectedProxy);
            console.log(`✅ HttpsProxyAgent 创建成功`);
            console.log(`   代理主机: ${agent.proxy.hostname || agent.proxy.host}`);
            console.log(`   代理端口: ${agent.proxy.port}`);
            console.log(`   代理协议: ${agent.proxy.protocol}`);
        } catch (error) {
            console.log(`❌ HttpsProxyAgent 创建失败: ${error.message}`);
        }
    } else {
        console.log(`ℹ️  未检测到代理配置，将使用直接连接`);
    }
}

function runAllTests() {
    console.log('开始代理配置检测测试...\n');

    for (const config of testConfigs) {
        testProxyDetection(config);
    }

    console.log('\n========== 测试完成 ==========');
    console.log('\n总结:');
    console.log('1. 代理环境变量检测优先级: HTTPS_PROXY > https_proxy > HTTP_PROXY > http_proxy > ALL_PROXY > all_proxy');
    console.log('2. 推荐设置: export https_proxy=http://127.0.0.1:7890');
    console.log('3. 或者设置: export HTTPS_PROXY=http://127.0.0.1:7890');
    console.log('4. SOCKS5 代理: export ALL_PROXY=socks5://127.0.0.1:7890');
    console.log('5. 验证设置: echo $https_proxy');
}

// 运行测试
runAllTests();