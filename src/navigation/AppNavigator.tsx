import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainMenuScreen from '../screens/MainMenuScreen';
import InformationScreen from '../screens/InformationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameModeScreen from '../screens/GameModeScreen';
import EasyModeScreen from '../screens/EasyModeScreen';
import MediumModeScreen from '../screens/MediumModeScreen';
import HardModeScreen from '../screens/HardModeScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainMenu"    component={MainMenuScreen} />
        <Stack.Screen name="GameMode"    component={GameModeScreen} />
        <Stack.Screen name="EasyMode"    component={EasyModeScreen} />
        <Stack.Screen name="MediumMode"  component={MediumModeScreen} />
        <Stack.Screen name="HardMode"    component={HardModeScreen} />
        <Stack.Screen name="Information" component={InformationScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Result"      component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}