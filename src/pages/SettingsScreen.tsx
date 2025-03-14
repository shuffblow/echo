import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingItem {
  title: string;
  description: string;
  type: 'switch' | 'input' | 'select';
  key: string;
  value: any;
  options?: string[];
}

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      title: '自动播放回复',
      description: '收到AI回复时自动播放语音',
      type: 'switch',
      key: 'autoPlayResponse',
      value: true,
    },
    {
      title: 'OpenAI API Key',
      description: '设置您的OpenAI API密钥',
      type: 'input',
      key: 'openaiApiKey',
      value: '',
    },
    {
      title: '语音语速',
      description: '设置AI语音的播放速度',
      type: 'select',
      key: 'speechRate',
      value: '正常',
      options: ['较慢', '正常', '较快'],
    },
    {
      title: '语音音调',
      description: '设置AI语音的音调',
      type: 'select',
      key: 'speechPitch',
      value: '正常',
      options: ['较低', '正常', '较高'],
    },
  ]);
  
  // 保存设置
  const saveSettings = async () => {
    try {
      const settingsObj = settings.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, any>);
      
      await AsyncStorage.setItem('appSettings', JSON.stringify(settingsObj));
      Alert.alert('成功', '设置已保存');
    } catch (error) {
      console.error('保存设置失败:', error);
      Alert.alert('错误', '保存设置失败');
    }
  };
  
  // 更新设置值
  const updateSetting = (key: string, value: any) => {
    setSettings(settings.map(item => 
      item.key === key ? { ...item, value } : item
    ));
  };
  
  // 渲染设置项
  const renderSettingItem = (item: SettingItem) => {
    return (
      <View key={item.key} className="border-b border-gray-200 py-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800">{item.title}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.description}</Text>
          </View>
          
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={(value) => updateSetting(item.key, value)}
              trackColor={{ false: '#D1D5DB', true: '#60A5FA' }}
              thumbColor={item.value ? '#2563EB' : '#F9FAFB'}
            />
          )}
          
          {item.type === 'select' && (
            <View className="flex-row items-center">
              <Text className="text-gray-800 mr-2">{item.value}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          )}
        </View>
        
        {item.type === 'input' && (
          <TextInput
            className="mt-2 p-3 bg-gray-100 rounded-lg text-gray-800"
            value={item.value}
            onChangeText={(text) => updateSetting(item.key, text)}
            placeholder={`输入${item.title}`}
            secureTextEntry={item.key.toLowerCase().includes('key') || item.key.toLowerCase().includes('secret')}
          />
        )}
        
        {item.type === 'select' && item.options && (
          <View className="mt-2 flex-row flex-wrap">
            {item.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => updateSetting(item.key, option)}
                className={`mr-2 mb-2 px-3 py-2 rounded-full ${
                  item.value === option ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`${
                    item.value === option ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="flex-1 px-4 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">设置</Text>
        
        <ScrollView className="flex-1">
          {settings.map(renderSettingItem)}
          
          <TouchableOpacity
            onPress={saveSettings}
            className="bg-blue-500 p-4 rounded-lg mt-6"
          >
            <Text className="text-white text-center font-semibold">保存设置</Text>
          </TouchableOpacity>
          
          <View className="mt-8 items-center">
            <Text className="text-gray-400 text-sm">Echo 英语口语助手</Text>
            <Text className="text-gray-400 text-xs mt-1">版本 1.0.0</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
