// navegador raiz: si no hay sesion muestra Login, si hay muestra Main + Settings

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Login/LoginScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import TabNavigator from './TabNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // mientras revisa si hay sesion guardada
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
