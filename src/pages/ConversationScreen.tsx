import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useConversationStore } from '../stores/conversationStore';
import MessageBubble from '../components/MessageBubble';
import RecordButton from '../components/RecordButton';
import TopicSelector from '../components/TopicSelector';
import { getChatResponse, speakText, stopSpeaking } from '../services/aiService';

const TOPICS = [
  '日常对话',
  '旅游',
  '工作面试',
  '购物',
  '餐厅点餐',
  '社交活动',
  '学术讨论',
  '医疗咨询',
];

const ConversationScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  
  const {
    messages,
    isRecording,
    isProcessing,
    currentTopic,
    addMessage,
    clearMessages,
    setIsRecording,
    setIsProcessing,
    setCurrentTopic,
  } = useConversationStore();
  
  // 自动滚动到底部
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  // 处理录音完成
  const handleRecordingComplete = async (text: string) => {
    if (!text.trim()) return;
    
    // 添加用户消息
    addMessage('user', text);
    
    try {
      // 获取AI回复
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // 添加用户新消息
      formattedMessages.push({
        role: 'user',
        content: text,
      });
      
      // 获取AI响应
      const response = await getChatResponse(formattedMessages);
      
      // 添加AI回复
      addMessage('assistant', response);
      
      // 自动播放AI回复
      await speakText(response);
    } catch (error) {
      console.error('获取AI回复失败:', error);
      addMessage('assistant', '抱歉，我现在无法回应，请稍后再试。');
    }
  };
  
  // 处理音频播放
  const handlePlayAudio = (messageId: string) => {
    // 如果有正在播放的消息，先停止
    if (playingMessageId) {
      stopSpeaking();
      setPlayingMessageId(null);
    }
    
    // 设置当前播放的消息ID
    setPlayingMessageId(messageId);
    
    // 找到对应消息并播放
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      speakText(message.content).then(() => {
        setPlayingMessageId(null);
      }).catch(error => {
        console.error('播放音频失败:', error);
        setPlayingMessageId(null);
      });
    }
  };
  
  // 清空对话
  const handleClearConversation = () => {
    clearMessages();
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 px-4 pb-4 pt-2">
        {/* 头部区域 */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Echo 英语口语助手</Text>
          
          <TouchableOpacity 
            onPress={handleClearConversation}
            className="p-2"
          >
            <Ionicons name="refresh" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        {/* 主题选择器 */}
        <TopicSelector
          topics={TOPICS}
          currentTopic={currentTopic}
          onSelectTopic={setCurrentTopic}
        />
        
        {/* 对话区域 */}
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isPlaying={playingMessageId === item.id}
                onPlayAudio={handlePlayAudio}
              />
            )}
            className="flex-1"
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="chatbubble-ellipses-outline" size={80} color="#E5E7EB" />
            <Text className="text-gray-400 text-lg mt-4">开始录音，与AI对话练习英语</Text>
            <Text className="text-gray-400 mt-2">当前主题：{currentTopic}</Text>
          </View>
        )}
        
        {/* 录音按钮 */}
        <View className="pt-4 pb-2 items-center">
          <RecordButton
            isRecording={isRecording}
            isProcessing={isProcessing}
            onRecordingStart={() => setIsRecording(true)}
            onRecordingComplete={handleRecordingComplete}
            onProcessingStart={() => {
              setIsRecording(false);
              setIsProcessing(true);
            }}
            onProcessingComplete={() => setIsProcessing(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ConversationScreen;
