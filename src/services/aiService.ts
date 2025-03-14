import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import OpenAI from 'openai';

// 使用OpenAI客户端
// 注意：需要在环境变量中设置OPENAI_API_KEY，或在此处直接设置
const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 允许在客户端使用，生产环境中应使用后端代理
});

// 将音频转换为文本
export const transcribeAudio = async (audioUri: string): Promise<string> => {
  try {
    // 将音频文件转换为 Blob
    const response = await fetch(audioUri);
    const blob = await response.blob();
    
    // 创建一个文件对象
    const file = new File([blob], 'recording.m4a', { type: 'audio/m4a' });
    
    // 调用OpenAI的转录API
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    });
    
    return transcription.text;
  } catch (error) {
    console.error('音频转录失败:', error);
    throw error;
  }
};

// 获取AI回复
export const getChatResponse = async (messages: { role: string; content: string }[]): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一位友好、有耐心的英语口语教师。你的目标是帮助学生提高英语口语能力。请用简单、自然的英语回答问题，并纠正学生的错误。在适当的时候，你可以提供英语口语建议，包括发音、语法和表达方式。',
        },
        ...messages,
      ],
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || '抱歉，我现在无法回应，请稍后再试。';
  } catch (error) {
    console.error('获取AI回复失败:', error);
    throw error;
  }
};

// 文本转语音
export const speakText = async (text: string, language = 'en-US'): Promise<void> => {
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language,
      rate: 0.9,
      pitch: 1.0,
      onDone: () => resolve(),
      onError: (error) => reject(error),
    });
  });
};

// 停止语音
export const stopSpeaking = (): void => {
  Speech.stop();
};

// 录制音频
export const startRecording = async (): Promise<{ recording: Audio.Recording }> => {
  try {
    // 请求音频录制权限
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      throw new Error('需要麦克风权限才能录制音频');
    }
    
    // 配置音频模式
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    
    // 创建录音对象
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    
    return { recording };
  } catch (error) {
    console.error('开始录音失败:', error);
    throw error;
  }
};

// 停止录音
export const stopRecording = async (recording: Audio.Recording): Promise<string> => {
  try {
    await recording.stopAndUnloadAsync();
    
    // 重置音频模式
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
    
    // 获取录音URI
    const uri = recording.getURI();
    if (!uri) {
      throw new Error('无法获取录音文件');
    }
    
    return uri;
  } catch (error) {
    console.error('停止录音失败:', error);
    throw error;
  }
};
