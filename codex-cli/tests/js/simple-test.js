#!/usr/bin/env node

/**
 * @Author dailingfei
 * 简化的 OpenAI API 测试
 */

// 设置 DEBUG 环境变量以启用日志
process.env.DEBUG = '1';
// 设置较短的 OpenAI 超时以快速失败
process.env.OPENAI_TIMEOUT_MS = '3000';

import OpenAI from 'openai';

console.log('=== 简化 OpenAI API 测试 ===');

// 检查 API 密钥
if (!process.env.OPENAI_API_KEY) {
    console.log('警告: 未设置 OPENAI_API_KEY 环境变量');
    process.exit(1);
}

// 创建 OpenAI 客户端
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 3000
});

console.log('开始测试 OpenAI API 连接...');

async function testOpenAIConnection() {
    try {
        // 测试简单的 chat completion
        console.log('调用 chat.completions.create...');
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 10
        });
        console.log('API 调用成功:', response.choices[0]?.message?.content);
    } catch (error) {
        console.log('API 调用失败:', error.message);
        console.log('错误类型:', error.constructor.name);
        console.log('错误详情:', error);
    } finally {
        console.log('测试结束');
    }
}

testOpenAIConnection();