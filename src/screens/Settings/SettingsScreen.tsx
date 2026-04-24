// pantalla de configuracion y perfil

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { MockCurrentUser } from '../../data/mockData';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { settingsStyles as s } from './SettingsScreen.styles';

type SettingsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type IconName = keyof typeof Ionicons.glyphMap;

// item de la lista
interface SettingItemProps {
  icon: IconName;
  label: string;
  value?: string;
  showDivider?: boolean;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  showDivider = true,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[s.item, showDivider && s.itemDivider]}
      onPress={onPress}
    >
      <View style={s.itemIconBox}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={s.itemContent}>
        <Text style={s.itemLabel}>{label}</Text>
        {value && <Text style={s.itemValue}>{value}</Text>}
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={Colors.textTertiary}
        style={s.itemChevron}
      />
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsNavigationProp>();

  // animacion de entrada
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  // cierra sesion y vuelve al login
  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // saca las iniciales del nombre para el avatar
  const initials = MockCurrentUser.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* banner */}
      <View style={[s.banner, { paddingTop: insets.top + 10 }]}>
        <View style={s.bannerTopRow}>
          <TouchableOpacity
            style={s.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.bannerTitle}>Configuración</Text>
        </View>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fade,
          transform: [{ translateY: slide }],
        }}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* perfil */}
          <View style={s.profileCard}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={s.profileInfo}>
              <Text style={s.profileName}>{MockCurrentUser.fullName}</Text>
              <Text style={s.profileRole}>{MockCurrentUser.role}</Text>
              <Text style={s.profileInstitution}>
                {MockCurrentUser.programCode}
              </Text>
            </View>
          </View>

          {/* cuenta */}
          <Text style={s.sectionTitle}>Cuenta</Text>
          <View style={s.sectionCard}>
            <SettingItem
              icon="person-outline"
              label="Editar perfil"
              value={MockCurrentUser.email}
            />
            <SettingItem
              icon="lock-closed-outline"
              label="Cambiar contraseña"
            />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Privacidad"
              showDivider={false}
            />
          </View>

          {/* preferencias */}
          <Text style={s.sectionTitle}>Preferencias</Text>
          <View style={s.sectionCard}>
            <SettingItem
              icon="notifications-outline"
              label="Notificaciones"
              value="Activadas"
            />
            <SettingItem
              icon="moon-outline"
              label="Tema"
              value="Claro"
            />
            <SettingItem
              icon="language-outline"
              label="Idioma"
              value="Español"
              showDivider={false}
            />
          </View>

          {/* informacion */}
          <Text style={s.sectionTitle}>Información</Text>
          <View style={s.sectionCard}>
            <SettingItem
              icon="information-circle-outline"
              label="Acerca de"
            />
            <SettingItem
              icon="document-text-outline"
              label="Términos y condiciones"
            />
            <SettingItem
              icon="help-circle-outline"
              label="Ayuda y soporte"
              showDivider={false}
            />
          </View>

          {/* logout */}
          <TouchableOpacity
            style={s.logoutButton}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
            <Text style={s.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <Text style={s.versionText}>FamilyMed App v1.0.0</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default SettingsScreen;
