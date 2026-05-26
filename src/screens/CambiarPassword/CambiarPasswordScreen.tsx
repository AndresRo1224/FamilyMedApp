// pantalla para cambiar la contraseña (requiere la actual)

import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeCambiarPasswordStyles } from './CambiarPasswordScreen.styles';

type CambiarPasswordNav = NativeStackNavigationProp<
  RootStackParamList,
  'CambiarPassword'
>;

const CambiarPasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CambiarPasswordNav>();
  const { changePassword } = useAuth();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { showToast } = useToast();
  const s = useMemo(() => makeCambiarPasswordStyles(colors), [colors]);

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!actual || !nueva || !confirmar) {
      haptics.warning();
      showToast('Llena los 3 campos', 'error');
      return;
    }
    if (nueva.length < 8) {
      haptics.warning();
      showToast('La nueva contraseña debe tener mínimo 8 caracteres', 'error');
      return;
    }
    if (nueva.length > 128) {
      haptics.warning();
      showToast('La contraseña es muy larga (máximo 128)', 'error');
      return;
    }
    if (nueva !== confirmar) {
      haptics.warning();
      showToast('La nueva contraseña no coincide con la confirmación', 'error');
      return;
    }
    if (nueva === actual) {
      haptics.warning();
      showToast('La nueva debe ser diferente a la actual', 'error');
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        password_actual: actual,
        password_nueva: nueva,
      });
      haptics.success();
      showToast('Contraseña actualizada', 'success');
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      haptics.error();
      showToast(`No se pudo cambiar: ${msg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // input con toggle de mostrar/ocultar password
  const renderPasswordInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    placeholder: string,
  ) => (
    <View style={s.inputGroup}>
      <Text style={s.inputLabel}>{label}</Text>
      <View style={s.inputWrapper}>
        <Ionicons
          name="lock-closed-outline"
          size={18}
          color={colors.textTertiary}
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={!show}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={{ padding: 4 }}>
          <Ionicons
            name={show ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={[s.banner, { paddingTop: insets.top + 10 }]}>
        <View style={s.bannerRow}>
          <TouchableOpacity
            style={s.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.bannerTitle}>Cambiar contraseña</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.helperText}>
          Por seguridad, debes ingresar tu contraseña actual para cambiarla.
        </Text>

        {renderPasswordInput(
          'Contraseña actual',
          actual,
          setActual,
          showActual,
          setShowActual,
          'Tu contraseña actual',
        )}
        {renderPasswordInput(
          'Nueva contraseña',
          nueva,
          setNueva,
          showNueva,
          setShowNueva,
          'Mínimo 8 caracteres',
        )}
        {renderPasswordInput(
          'Confirmar nueva',
          confirmar,
          setConfirmar,
          showNueva,
          setShowNueva,
          'Repite la nueva contraseña',
        )}

        <TouchableOpacity
          style={[s.primaryButton, loading && { opacity: 0.6 }]}
          activeOpacity={0.85}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={s.primaryButtonText}>Cambiar contraseña</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CambiarPasswordScreen;
