import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ChatScreen from '../pages/chatScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

const Tab = createBottomTabNavigator()

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarStyle: { borderTopWidth: 0 }
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="message-text-outline"
              size={24}
              color={color}
            />
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default RootNavigator