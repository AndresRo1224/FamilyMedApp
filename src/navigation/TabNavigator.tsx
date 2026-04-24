// navegacion por tabs

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import ContenidosScreen from '../screens/Contenidos/ContenidosScreen';
import CalculadorasScreen from '../screens/Calculadoras/CalculadorasScreen';
import AtlasScreen from '../screens/Atlas/AtlasScreen';
import GuiasScreen from '../screens/Guias/GuiasScreen';

import { tabNavigatorStyles as s } from './TabNavigator.styles';

export type TabParamList = {
  Home: undefined;
  Contenidos: undefined;
  Calculadoras: undefined;
  Atlas: undefined;
  Guias: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// boton custom del tab
interface CustomTabButtonProps extends BottomTabBarButtonProps {
  label: string;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  label,
  accessibilityState,
  onPress,
}) => {
  const focused = accessibilityState?.selected ?? false;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={s.tabButton}
      onPress={onPress ?? undefined}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
    >
      <View style={[s.pill, focused ? s.pillActive : s.pillInactive]}>
        <Text style={[s.label, focused ? s.labelActive : s.labelInactive]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: s.tabBar,
};

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Inicio" />
          ),
        }}
      />
      <Tab.Screen
        name="Contenidos"
        component={ContenidosScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Temas" />
          ),
        }}
      />
      <Tab.Screen
        name="Calculadoras"
        component={CalculadorasScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Cálculos" />
          ),
        }}
      />
      <Tab.Screen
        name="Atlas"
        component={AtlasScreen}
        options={{
          tabBarButton: (props) => <CustomTabButton {...props} label="Atlas" />,
        }}
      />
      <Tab.Screen
        name="Guias"
        component={GuiasScreen}
        options={{
          tabBarButton: (props) => <CustomTabButton {...props} label="Guías" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
