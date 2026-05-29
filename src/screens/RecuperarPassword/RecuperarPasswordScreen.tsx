// pantalla de recuperar contraseña
// la recuperacion automatica por correo queda como funcion "proximamente";
// por ahora se indica al usuario contactar a soporte / docente.

import React, { useMemo } from 'react';
import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../contexts/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeRecuperarPasswordStyles } from './RecuperarPasswordScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RecuperarPassword'>;

const SOPORTE_EMAIL = 'familymed.udes@gmail.com';

const RecuperarPasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const s = useMemo(() => makeRecuperarPasswordStyles(colors), [colors]);

  const escribirSoporte = () => {
    haptics.tap();
    const asunto = encodeURIComponent('Recuperar contraseña - FamilyMed');
    const cuerpo = encodeURIComponent(
      'Hola, olvidé mi contraseña de FamilyMed. Mi correo registrado es: ',
    );
    Linking.openURL(
      `mailto:${SOPORTE_EMAIL}?subject=${asunto}&body=${cuerpo}`,
    ).catch(() => {
      // si no hay app de correo configurada, no hacemos nada
    });
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* banner con back */}
      <View style={[s.banner, { paddingTop: insets.top + 10 }]}>
        <View style={s.bannerRow}>
          <TouchableOpacity
            style={s.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.bannerTitle}>Recuperar contraseña</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={local.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            local.iconCircle,
            { backgroundColor: colors.primary + '14' },
          ]}
        >
          <Ionicons name="mail-unread-outline" size={48} color={colors.primary} />
        </View>

        <View style={[local.badge, { backgroundColor: colors.gold }]}>
          <Text style={local.badgeText}>PRÓXIMAMENTE</Text>
        </View>

        <Text style={[local.title, { color: colors.text }]}>
          Recuperación por correo
        </Text>
        <Text style={[local.desc, { color: colors.textSecondary }]}>
          Estamos terminando la recuperación automática de contraseña por
          correo electrónico. Estará disponible muy pronto.
        </Text>

        <View
          style={[
            local.infoBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={[local.infoText, { color: colors.textSecondary }]}>
            Mientras tanto, si olvidaste tu contraseña, escríbenos y te
            ayudamos a restablecer tu acceso.
          </Text>
        </View>

        <TouchableOpacity
          style={[local.primaryBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.85}
          onPress={escribirSoporte}
        >
          <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
          <Text style={local.primaryBtnText}>Escribir a soporte</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={local.secondaryBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={[local.secondaryBtnText, { color: colors.primary }]}>
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const local = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 14,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    height: 52,
    alignSelf: 'stretch',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RecuperarPasswordScreen;
