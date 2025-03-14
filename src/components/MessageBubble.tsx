import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Message } from '../stores/conversationStore';
import { speakText, stopSpeaking } from '../services/aiService';

interface MessageBubbleProps {
  message: Message;
  isPlaying: boolean;
  onPlayAudio: (messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isPlaying, onPlayAudio }) => {
  const isUser = message.role === 'user';
  
  const handlePlayAudio = () => {
    if (isPlaying) {
      stopSpeaking();
    } else if (message.content) {
      onPlayAudio(message.id);
      speakText(message.content);
    }
  };
  
  return (
    <View 
      className={`flex-row my-2 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <View 
        className={`rounded-2xl p-3 max-w-[80%] ${
          isUser ? 'bg-blue-500' : 'bg-gray-200'
        }`}
      >
        <Text 
          className={`text-base ${
            isUser ? 'text-white' : 'text-gray-800'
          }`}
        >
          {message.content}
        </Text>
        
        <View className="flex-row justify-between items-center mt-2">
          <Text 
            className={`text-xs ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
          
          {!isUser && (
            <TouchableOpacity 
              onPress={handlePlayAudio}
              className="ml-2"
            >
              {isPlaying ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Ionicons name="volume-medium" size={20} color="#4F46E5" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
