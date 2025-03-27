// src/pages/chatScreen/index.tsx
import React, { useState, useRef } from 'react'
import { 
  View, Text, FlatList, TouchableOpacity, 
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { startRecording, stopRecording } from '../../utils/voice'
import { getAIResponse, ChatMessage, transcribeAudio } from '../../utils/aiService'

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  
  const handleStartRecording = async () => {
    setIsRecording(true)
    await startRecording()
  }
  
  const handleStopRecording = async () => {
    setIsRecording(false)
    setIsLoading(true)
    
    try {
      const audioUri = await stopRecording()
      if (!audioUri) return
      
      // 语音转文本
      const transcript = await transcribeAudio(audioUri)
      
      // 添加用户消息到聊天记录
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: transcript,
        role: 'user',
        audioUrl: audioUri
      }
      
      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      
      // 获取AI回复
      const aiResponse = await getAIResponse(updatedMessages)
      
      // 添加AI回复到聊天记录
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant'
      }
      
      setMessages([...updatedMessages, assistantMessage])
      
      // 滚动到最新消息
      flatListRef.current?.scrollToEnd({ animated: true })
    } catch (error) {
      console.error('处理录音失败:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View className={`mb-4 ${item.role === 'assistant' ? 'items-start' : 'items-end'} w-full`}>
      <View className={`max-w-[80%] rounded-lg p-3 ${item.role === 'assistant' ? 'bg-white' : 'bg-blue-500'}`}>
        <Text className={item.role === 'assistant' ? 'text-gray-800' : 'text-white'}>
          {item.content}
        </Text>
        
        {item.audioUrl && (
          <TouchableOpacity 
            onPress={() => playAudio(item.audioUrl!)}
            className="mt-2 flex-row items-center"
          >
            <MaterialCommunityIcons name="play-circle" size={18} color={item.role === 'assistant' ? '#333' : '#fff'} />
            <Text className={`ml-1 ${item.role === 'assistant' ? 'text-gray-600' : 'text-gray-100'}`}>
              播放录音
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        {isLoading ? (
          <View className="h-16 items-center justify-center">
            <ActivityIndicator size="large" color="#007AFF" />
            <Text className="mt-2 text-gray-500">处理中...</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPressIn={handleStartRecording}
            onPressOut={handleStopRecording}
            className="h-16 rounded-full bg-blue-500 items-center justify-center"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons 
                name={isRecording ? "microphone" : "microphone-outline"} 
                size={24} 
                color="white" 
              />
              <Text className="ml-2 text-white font-medium text-lg">
                {isRecording ? "录音中..." : "按住说话"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}