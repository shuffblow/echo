import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

interface TopicSelectorProps {
  topics: string[];
  currentTopic: string;
  onSelectTopic: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  currentTopic,
  onSelectTopic,
}) => {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-2"
      >
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic}
            onPress={() => onSelectTopic(topic)}
            className={`mr-2 px-4 py-2 rounded-full ${
              currentTopic === topic ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`font-medium ${
                currentTopic === topic ? 'text-white' : 'text-gray-800'
              }`}
            >
              {topic}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopicSelector;
