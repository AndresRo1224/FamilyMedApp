// pantalla de configuracion y perfil

import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { settingsStyles as s } from './SettingsScreen.styles';

type SettingsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type IconName = keyof typeof Ionicons.glyphMap;

// item generico de la lista
interface SettingItemProps {
  icon: IconName;
  label: string;
  value?: string;
  showDivider?: boolean;
  rightSlot?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  showDivider = true,
  rightSlot,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
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
      {rightSlot ? (
        rightSlot
      ) : (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.textTertiary}
          style={s.itemChevron}
        />
      )}
    </TouchableOpacity>
  );
};

// modal sencillo para "Acerca de" / "Términos" / "Ayuda"
interface InfoModalProps {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, title, body, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: Colors.text,
              marginBottom: 12,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: Colors.textSecondary,
              marginBottom: 20,
            }}
          >
            {body}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.85}
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsNavigationProp>();
  const { user, signOut } = useAuth();

  // toggles locales (preferencias visuales, no persistentes por ahora)
  const [notificaciones, setNotificaciones] = useState(true);

  // modales informativos
  const [modalKey, setModalKey] = useState<null | 'acerca' | 'terminos' | 'ayuda'>(null);

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

  // confirmacion antes de cerrar sesion
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            // RootNavigator detecta que ya no hay user y muestra Login
          },
        },
      ],
    );
  };

  // info para los modales
  const modalContent = {
    acerca: {
      title: 'Acerca de FamilyMed',
      body:
        'FamilyMed App v1.0.0\n\n' +
        'Aplicación educativa de Medicina Familiar enfocada en ' +
        'hipertensión arterial. Proyecto de grado de la Universidad ' +
        'de Santander (UDES) - Facultad de Medicina, código ' +
        '65-2026-071.\n\nDesarrollada por Andrés Felipe Rangel Ochoa.',
    },
    terminos: {
      title: 'Términos y condiciones',
      body:
        'El contenido clínico de esta app es de carácter educativo. ' +
        'No reemplaza el juicio clínico del profesional de salud ni ' +
        'establece relación médico-paciente. Los datos se manejan ' +
        'según la Ley 1581 de 2012 (Habeas Data en Colombia).',
    },
    ayuda: {
      title: 'Ayuda y soporte',
      body:
        'Si encuentras algún error o tienes sugerencias, escríbenos a ' +
        'andresrangel8a@gmail.com\n\nIncluye una captura de pantalla ' +
        'y describe brevemente lo que pasó.',
    },
  };

  // datos del usuario logueado
  const fullName = user?.nombre_completo || 'Usuario';
  const email = user?.correo || '';
  const rol = user?.rol === 'docente'
    ? 'Docente'
    : user?.rol === 'admin'
      ? 'Administrador'
      : 'Estudiante';
  const codigo = user?.codigo_programa || '';

  // iniciales del nombre para el avatar
  const initials = fullName
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
              <Text style={s.profileName}>{fullName}</Text>
              <Text style={s.profileRole}>{rol}</Text>
              {codigo ? (
                <Text style={s.profileInstitution}>{codigo}</Text>
              ) : null}
            </View>
          </View>

          {/* cuenta */}
          <Text style={s.sectionTitle}>Cuenta</Text>
          <View style={s.sectionCard}>
            <SettingItem
              icon="mail-outline"
              label="Correo"
              value={email}
              showDivider={false}
              onPress={() => {}}
            />
          </View>

          {/* preferencias */}
          <Text style={s.sectionTitle}>Preferencias</Text>
          <View style={s.sectionCard}>
            <SettingItem
              icon="notifications-outline"
              label="Notificaciones"
              rightSlot={
                <Switch
                  value={notificaciones}
                  onValueChange={setNotificaciones}
                  trackColor={{ false: '#cbd5e1', true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              icon="moon-outline"
              label="Tema"
              value="Claro"
              showDivider={false}
              onPress={() =>
                Alert.alert(
                  'Tema',
                  'El cambio de tema en la app móvil estará disponible próximamente.',
                )
              }
            />
          </View>

          {/* informacion */}
          <Text style={s.sectionTitle}>Información</Text>
          <View style={s.sectionCard}>
            <SettingItem
              icon="information-circle-outline"
              label="Acerca de"
              onPress={() => setModalKey('acerca')}
            />
            <SettingItem
              icon="document-text-outline"
              label="Términos y condiciones"
              onPress={() => setModalKey('terminos')}
            />
            <SettingItem
              icon="help-circle-outline"
              label="Ayuda y soporte"
              showDivider={false}
              onPress={() => setModalKey('ayuda')}
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

      {/* modal de info dinamico */}
      {modalKey && (
        <InfoModal
          visible
          title={modalContent[modalKey].title}
          body={modalContent[modalKey].body}
          onClose={() => setModalKey(null)}
        />
      )}
    </View>
  );
};

export default SettingsScreen;
