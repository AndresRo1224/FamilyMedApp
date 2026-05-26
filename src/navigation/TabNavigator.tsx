// navegacion por tabs

import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import BibliografiaScreen from '../screens/Bibliografia/BibliografiaScreen';

import { useTheme } from '../contexts/ThemeContext';
import { makeTabNavigatorStyles } from './TabNavigator.styles';

export type TabParamList = {
  Home: undefined;
  Contenidos: undefined;
  Calculadoras: undefined;
  Atlas: undefined;
  Guias: undefined;
  Bibliografia: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// tipo de nombre de icono de Ionicons
type IconName = keyof typeof Ionicons.glyphMap;

// iconos para cada tab (outline inactivo, filled activo)
const TAB_ICONS: Record<
  keyof TabParamList,
  { active: IconName; inactive: IconName }
> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Contenidos: { active: 'book', inactive: 'book-outline' },
  Calculadoras: { active: 'calculator', inactive: 'calculator-outline' },
  Atlas: { active: 'images', inactive: 'images-outline' },
  Guias: { active: 'clipboard', inactive: 'clipboard-outline' },
  Bibliografia: { active: 'bookmark', inactive: 'bookmark-outline' },
};

// boton custom del tab
interface CustomTabButtonProps extends BottomTabBarButtonProps {
  name: keyof TabParamList;
  label: string;
}

const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  name,
  label,
  accessibilityState,
  onPress,
}) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeTabNavigatorStyles(colors), [colors]);
  const focused = accessibilityState?.selected ?? false;
  const iconName = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
  const color = focused ? colors.primary : colors.textSecondary;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={s.tabButton}
      onPress={onPress ?? undefined}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
    >
      {focused && <View style={s.indicator} />}
      <View style={[s.tabContent, focused && s.tabContentActive]}>
        <View style={s.iconBox}>
          <Ionicons name={iconName} size={22} color={color} />
        </View>
        <Text style={[s.label, focused ? s.labelActive : s.labelInactive]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const s = useMemo(() => makeTabNavigatorStyles(colors), [colors]);
  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: s.tabBar,
  };
  return (
    <Tab.Navigator screenOptions={screenOptions} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="Home" label="Inicio" />
          ),
        }}
      />
      <Tab.Screen
        name="Contenidos"
        component={ContenidosScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="Contenidos" label="Temas" />
          ),
        }}
      />
      <Tab.Screen
        name="Calculadoras"
        component={CalculadorasScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="Calculadoras" label="Cálculos" />
          ),
        }}
      />
      <Tab.Screen
        name="Atlas"
        component={AtlasScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="Atlas" label="Atlas" />
          ),
        }}
      />
      <Tab.Screen
        name="Guias"
        component={GuiasScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="Guias" label="Guías" />
          ),
        }}
      />
      <Tab.Screen
        name="Bibliografia"
        component={BibliografiaScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} name="Bibliografia" label="Biblio" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
