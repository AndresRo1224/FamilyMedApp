// pantalla para recuperar contraseña con codigo enviado al correo
// 2 pasos: 1) pedir correo  2) meter codigo + nueva contraseña

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

import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useHaptics } from '../../hooks/useHaptics';
import { confirmarReset, solicitarReset } from '../../services/auth';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeRecuperarPasswordStyles } from './RecuperarPasswordScreen.styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RecuperarPassword'>;

const RecuperarPasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const haptics = useHaptics();
  const s = useMemo(() => makeRecuperarPasswordStyles(colors), [colors]);

  // paso 1 = pedir correo, paso 2 = codigo + nueva contraseña
  const [step, setStep] = useState<1 | 2>(1);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // paso 1: pide el codigo al backend
  const handleSolicitar = async () => {
    const mail = correo.trim().toLowerCase();
    if (!mail || !mail.includes('@')) {
      haptics.warning();
      showToast('Ingresa un correo válido', 'error');
      return;
    }
    setLoading(true);
    try {
      const msg = await solicitarReset(mail);
      haptics.success();
      showToast(msg, 'info');
      setStep(2);
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Error desconocido';
      haptics.error();
      showToast(m, 'error');
    } finally {
      setLoading(false);
    }
  };

  // paso 2: confirma el codigo y cambia la contraseña
  const handleConfirmar = async () => {
    const code = codigo.trim();
    if (code.length !== 6) {
      haptics.warning();
      showToast('El código son 6 dígitos', 'error');
      return;
    }
    if (nueva.length < 8 || nueva.length > 128) {
      haptics.warning();
      showToast('La contraseña debe tener entre 8 y 128 caracteres', 'error');
      return;
    }
    if (nueva !== confirmar) {
      haptics.warning();
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    setLoading(true);
    try {
      const msg = await confirmarReset({
        correo: correo.trim().toLowerCase(),
        codigo: code,
        password_nueva: nueva,
      });
      haptics.success();
      showToast(msg, 'success');
      navigation.goBack();
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Error desconocido';
      haptics.error();
      showToast(m, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* indicador de pasos */}
        <View style={s.stepsRow}>
          <View style={[s.stepDot, s.stepDotActive]}>
            <Text style={[s.stepDotText, { color: '#FFFFFF' }]}>1</Text>
          </View>
          <View style={[s.stepLine, step === 2 && s.stepLineActive]} />
          <View
            style={[
              s.stepDot,
              step === 2 ? s.stepDotActive : s.stepDotInactive,
            ]}
          >
            <Text
              style={[
                s.stepDotText,
                { color: step === 2 ? '#FFFFFF' : colors.textTertiary },
              ]}
            >
              2
            </Text>
          </View>
        </View>

        {step === 1 ? (
          <>
            <Text style={s.helperText}>
              Ingresa el correo de tu cuenta y te enviaremos un código de 6
              dígitos para restablecer tu contraseña.
            </Text>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Correo</Text>
              <View style={s.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={colors.textTertiary}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="correo@outlook.com"
                  placeholderTextColor={colors.textTertiary}
                  value={correo}
                  onChangeText={setCorreo}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[s.primaryButton, loading && { opacity: 0.6 }]}
              activeOpacity={0.85}
              onPress={handleSolicitar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={s.primaryButtonText}>Enviar código</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={s.helperText}>
              Escribe el código que enviamos a{' '}
              <Text style={s.emailHint}>{correo.trim().toLowerCase()}</Text> y
              tu nueva contraseña. El código vence en 15 minutos.
            </Text>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Código de 6 dígitos</Text>
              <TextInput
                style={s.codeInput}
                placeholder="000000"
                placeholderTextColor={colors.textTertiary}
                value={codigo}
                onChangeText={(t) => setCodigo(t.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Nueva contraseña</Text>
              <View style={s.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textTertiary}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={colors.textTertiary}
                  value={nueva}
                  onChangeText={setNueva}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Confirmar contraseña</Text>
              <View style={s.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textTertiary}
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="Repite la nueva contraseña"
                  placeholderTextColor={colors.textTertiary}
                  value={confirmar}
                  onChangeText={setConfirmar}
                  secureTextEntry={!showPass}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[s.primaryButton, loading && { opacity: 0.6 }]}
              activeOpacity={0.85}
              onPress={handleConfirmar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={s.primaryButtonText}>Restablecer contraseña</Text>
              )}
            </TouchableOpacity>

            {/* reenviar / volver al paso 1 */}
            <TouchableOpacity
              style={s.linkButton}
              activeOpacity={0.7}
              onPress={() => {
                setCodigo('');
                setStep(1);
              }}
            >
              <Text style={s.linkText}>¿No te llegó? Cambiar correo o reenviar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RecuperarPasswordScreen;
