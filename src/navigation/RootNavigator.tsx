// navegador raiz: si no hay sesion muestra Login, si hay muestra Main + Settings

import React from 'react';
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
import FavoritosScreen from '../screens/Favoritos/FavoritosScreen';
import BusquedaScreen from '../screens/Busqueda/BusquedaScreen';
import TabNavigator from './TabNavigator';
import SplashLogo from '../components/SplashLogo';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Settings: undefined;
  EditarPerfil: undefined;
  CambiarPassword: undefined;
  Favoritos: undefined;
  Busqueda: undefined;
  ContenidoDetail: { id: string };
  CalculadoraDetail: { id: string };
  AtlasDetail: { id: string };
  GuiaDetail: { id: string };
  BibliografiaDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  // permite que App.tsx mantenga el splash visible un tiempo minimo
  forceLoading?: boolean;
}

const RootNavigator: React.FC<RootNavigatorProps> = ({ forceLoading = false }) => {
  const { user, loading } = useAuth();

  // mientras revisa si hay sesion guardada, muestra el splash con branding UDES
  if (loading || forceLoading) {
    return <SplashLogo />;
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
          <Stack.Screen name="Favoritos" component={FavoritosScreen} />
          <Stack.Screen
            name="Busqueda"
            component={BusquedaScreen}
            options={{ animation: 'slide_from_bottom' }}
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
