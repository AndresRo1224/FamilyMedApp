// navegador raiz: si no hay sesion muestra Login, si hay muestra Main + Settings

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Login/LoginScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import EditarPerfilScreen from '../screens/EditarPerfil/EditarPerfilScreen';
import CambiarPasswordScreen from '../screens/CambiarPassword/CambiarPasswordScreen';
import ContenidoDetailScreen from '../screens/ContenidoDetail/ContenidoDetailScreen';
import CalculadoraDetailScreen from '../screens/CalculadoraDetail/CalculadoraDetailScreen';
import AtlasDetailScreen from '../screens/AtlasDetail/AtlasDetailScreen';
import GuiaDetailScreen from '../screens/GuiaDetail/GuiaDetailScreen';
import BibliografiaDetailScreen from '../screens/BibliografiaDetail/BibliografiaDetailScreen';
import TabNavigator from './TabNavigator';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Settings: undefined;
  EditarPerfil: undefined;
  CambiarPassword: undefined;
  ContenidoDetail: { id: string };
  CalculadoraDetail: { id: string };
  AtlasDetail: { id: string };
  GuiaDetail: { id: string };
  BibliografiaDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  // mientras revisa si hay sesion guardada
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
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
          <Stack.Screen
            name="EditarPerfil"
            component={EditarPerfilScreen}
          />
          <Stack.Screen
            name="CambiarPassword"
            component={CambiarPasswordScreen}
          />
          {/* las pantallas de detalle son modales: suben desde abajo */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
              name="ContenidoDetail"
              component={ContenidoDetailScreen}
            />
            <Stack.Screen
              name="CalculadoraDetail"
              component={CalculadoraDetailScreen}
            />
            <Stack.Screen
              name="AtlasDetail"
              component={AtlasDetailScreen}
            />
            <Stack.Screen
              name="GuiaDetail"
              component={GuiaDetailScreen}
            />
            <Stack.Screen
              name="BibliografiaDetail"
              component={BibliografiaDetailScreen}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
