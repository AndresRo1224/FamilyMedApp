/**
 * TabNavigator principal - FamilyMed App
 * 4 tabs: Home, Contenidos, Calculadoras, Atlas.
 * Diseño con colores oficiales UDES.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import ContenidosScreen from '../screens/Contenidos/ContenidosScreen';
import CalculadorasScreen from '../screens/Calculadoras/CalculadorasScreen';
import AtlasScreen from '../screens/Atlas/AtlasScreen';

import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

/**
 * Lista de rutas y sus parámetros. Permite tipado estricto
 * cuando se consuma con useNavigation / useRoute.
 */
export type TabParamList = {
  Home: undefined;
  Contenidos: undefined;
  Calculadoras: undefined;
  Atlas: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Icono custom del tab. Sin dependencias externas: el "icono" es una
 * pastilla (pill) con la etiqueta del tab. El fondo cambia cuando está activo.
 */
interface TabIconProps {
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ label, focused }) => {
  return (
    <View
      style={[
        styles.iconContainer,
        focused ? styles.iconContainerActive : styles.iconContainerInactive,
      ]}
    >
      <Text
        style={[
          styles.iconLabel,
          focused ? styles.iconLabelActive : styles.iconLabelInactive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

/**
 * Opciones globales del tab navigator.
 */
const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  tabBarItemStyle: {
    paddingHorizontal: 2,
  },
};

/**
 * Componente principal del TabNavigator.
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Inicio" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Contenidos"
        component={ContenidosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Contenidos" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Calculadoras"
        component={CalculadorasScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Cálculos" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Atlas"
        component={AtlasScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Atlas" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: Colors.primary,
  },
  iconContainerInactive: {
    backgroundColor: Colors.transparent,
  },
  iconLabel: {
    ...Typography.label,
    fontSize: 12,
  },
  iconLabelActive: {
    color: Colors.text,
  },
  iconLabelInactive: {
    color: Colors.textSecondary,
  },
});

export default TabNavigator;
