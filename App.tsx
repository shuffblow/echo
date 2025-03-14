import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ConversationScreen from './src/pages/ConversationScreen';
import SettingsScreen from './src/pages/SettingsScreen';

// 创建底部标签导航器
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === '对话') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === '设置') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            // 返回指定的图标组件
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2563EB',
          tabBarInactiveTintColor: '#6B7280',
          headerShown: false,
        })}
      >
        <Tab.Screen name="对话" component={ConversationScreen} />
        <Tab.Screen name="设置" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
