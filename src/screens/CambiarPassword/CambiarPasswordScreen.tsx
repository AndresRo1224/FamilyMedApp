// pantalla para cambiar la contraseña (requiere la actual)

import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const s = useMemo(() => makeCambiarPasswordStyles(colors), [colors]);

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!actual || !nueva || !confirmar) {
      Alert.alert('Faltan datos', 'Llena los 3 campos.');
      return;
    }
    if (nueva.length < 8) {
      Alert.alert('Contraseña corta', 'Mínimo 8 caracteres.');
      return;
    }
    if (nueva.length > 128) {
      Alert.alert('Contraseña larga', 'Máximo 128 caracteres.');
      return;
    }
    if (nueva !== confirmar) {
      Alert.alert('No coinciden', 'La nueva contraseña y la confirmación deben ser iguales.');
      return;
    }
    if (nueva === actual) {
      Alert.alert(
        'Contraseña igual',
        'La nueva contraseña debe ser diferente a la actual.',
      );
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        password_actual: actual,
        password_nueva: nueva,
      });
      Alert.alert('Listo', 'Tu contraseña fue actualizada.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      Alert.alert('No se pudo cambiar', msg);
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
