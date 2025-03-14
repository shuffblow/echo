import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { startRecording, stopRecording, transcribeAudio } from '../services/aiService';

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onRecordingStart: () => void;
  onRecordingComplete: (text: string) => void;
  onProcessingStart: () => void;
  onProcessingComplete: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  isRecording,
  isProcessing,
  onRecordingStart,
  onRecordingComplete,
  onProcessingStart,
  onProcessingComplete,
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const scale = useSharedValue(1);
  
  // 录音动画
  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // 开始录音动画
  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withSpring(1.2),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [isRecording, scale]);
  
  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 处理录音按钮点击
  const handleRecordPress = async () => {
    if (isRecording) {
      // 停止录音
      if (recording) {
        try {
          onProcessingStart();
          const uri = await stopRecording(recording);
          setRecording(null);
          
          // 转录音频
          const transcription = await transcribeAudio(uri);
          onRecordingComplete(transcription);
        } catch (error) {
          console.error('处理录音失败:', error);
        } finally {
          onProcessingComplete();
        }
      }
    } else {
      // 开始录音
      try {
        const { recording: newRecording } = await startRecording();
        setRecording(newRecording);
        onRecordingStart();
      } catch (error) {
        console.error('开始录音失败:', error);
      }
    }
  };
  
  return (
    <View className="items-center">
      {isRecording && (
        <Text className="text-gray-600 mb-2">{formatTime(recordingDuration)}</Text>
      )}
      
      <TouchableOpacity
        onPress={handleRecordPress}
        disabled={isProcessing}
        className="relative"
      >
        <Animated.View 
          className={`absolute rounded-full p-6 -m-6 ${
            isRecording ? 'bg-red-200' : 'bg-blue-100'
          }`}
          style={pulseStyle}
        />
        
        <View 
          className={`rounded-full p-4 ${
            isRecording ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" size="large" />
          ) : isRecording ? (
            <Ionicons name="square" size={24} color="white" />
          ) : (
            <Ionicons name="mic" size={24} color="white" />
          )}
        </View>
      </TouchableOpacity>
      
      <Text className="text-gray-600 mt-2">
        {isProcessing 
          ? '处理中...' 
          : isRecording 
            ? '点击停止' 
            : '按住说话'}
      </Text>
    </View>
  );
};

export default RecordButton;
