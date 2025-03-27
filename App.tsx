import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator'
import React from 'react';

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
