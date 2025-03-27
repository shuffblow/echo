// src/services/aiService.ts
import axios from 'axios'
import * as FileSystem from 'expo-file-system'

const OPENAI_API_KEY = 'YOUR_API_KEY' // 需替换为真实API Key

// 请替换为你的实际API密钥
const API_KEY = 'YOUR_OPENAI_API_KEY'

export interface ChatMessage {
    id: string
    content: string
    role: 'user' | 'assistant'
    audioUrl?: string
}

export async function getAIResponse(messages: ChatMessage[]): Promise<string> {
    try {
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: '你是一位英语教师，请用英语回复学生的问题，提供正确的语法和表达。' },
                    ...formattedMessages
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return response.data.choices[0].message.content
    } catch (error) {
        console.error('AI响应错误:', error)
        return '抱歉，无法获取回复。请稍后再试。'
    }
}

// 转录音频
export const transcribeAudio = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
    })

    const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        {
            file: base64,
            model: 'whisper-1'
        },
        {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    )

    return response.data.text
}

export const generateAIResponse = async (text: string) => {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: `Respond in English only: ${text}`
            }]
        },
        {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        }
    )

    return response.data.choices[0].message.content
}