// pantalla de login y registro con email/password

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
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
import { SERVER_BASE_URL } from '../../services/api';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeLoginStyles } from './LoginScreen.styles';

type LoginNav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<LoginNav>();
  const { signIn, signUp } = useAuth();
  const { colors } = useTheme();
  const s = useMemo(() => makeLoginStyles(colors), [colors]);

  const [isRegistro, setIsRegistro] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nombreFocused, setNombreFocused] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  // abre el panel web de docentes/admin en el navegador del sistema
  const handleAbrirPanelDocente = async () => {
    const url = `${SERVER_BASE_URL}/admin/`;
    try {
      const ok = await Linking.canOpenURL(url);
      if (!ok) {
        Alert.alert('No se pudo abrir', `No se puede abrir ${url}`);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Error', 'No se pudo abrir el panel web.');
    }
  };

  const handleEmailSubmit = async () => {
    const correo = email.trim().toLowerCase();

    if (!correo || !password) {
      Alert.alert('Faltan datos', 'Ingresa correo y contraseña.');
      return;
    }
    if (isRegistro && !nombre.trim()) {
      Alert.alert('Faltan datos', 'Ingresa tu nombre completo.');
      return;
    }
    if (isRegistro && password.length < 8) {
      Alert.alert('Contraseña corta', 'Mínimo 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistro) {
        await signUp({ correo, password, nombre_completo: nombre.trim() });
      } else {
        await signIn(correo, password);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      Alert.alert(
        isRegistro ? 'No se pudo registrar' : 'No se pudo iniciar sesión',
        msg,
      );
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

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* banner azul con logo UDES */}
        <View style={[s.banner, { paddingTop: insets.top + 24 }]}>
          <View style={s.logoContainer}>
            <Image
              source={require('../../../assets/images/logo udes color + EQUAA.png')}
              style={s.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={s.appName}>FamilyMed</Text>
          <Text style={s.institution}>Universidad de Santander</Text>
        </View>

        <Animated.View
          style={[
            s.form,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Text style={s.formTitle}>
            {isRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
          </Text>
          <Text style={s.formSubtitle}>
            Solo correos @outlook.com, @hotmail.com, @live.com o @udes.edu.co.
          </Text>

          {/* nombre completo (solo en registro) */}
          {isRegistro && (
            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Nombre completo</Text>
              <View
                style={[
                  s.inputWrapper,
                  nombreFocused && s.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={
                    nombreFocused ? colors.primary : colors.textTertiary
                  }
                  style={s.inputIcon}
                />
                <TextInput
                  style={s.input}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={colors.textTertiary}
                  value={nombre}
                  onChangeText={setNombre}
                  onFocus={() => setNombreFocused(true)}
                  onBlur={() => setNombreFocused(false)}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          {/* email */}
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Correo</Text>
            <View
              style={[
                s.inputWrapper,
                emailFocused && s.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={emailFocused ? colors.primary : colors.textTertiary}
                style={s.inputIcon}
              />
              <TextInput
                style={s.input}
                placeholder="correo@outlook.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          </View>

          {/* password */}
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Contraseña</Text>
            <View
              style={[
                s.inputWrapper,
                passwordFocused && s.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={passwordFocused ? colors.primary : colors.textTertiary}
                style={s.inputIcon}
              />
              <TextInput
                style={s.input}
                placeholder={isRegistro ? 'Mínimo 8 caracteres' : '••••••••'}
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={s.togglePassword}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* boton principal: enviar email/password */}
          <TouchableOpacity
            style={[s.primaryButton, { marginTop: 8 }]}
            activeOpacity={0.85}
            onPress={handleEmailSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.primaryButtonText}>
                {isRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
              </Text>
            )}
          </TouchableOpacity>

          {/* olvide mi contraseña (solo en modo login) */}
          {!isRegistro && (
            <TouchableOpacity
              style={{ marginTop: 14, alignItems: 'center' }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RecuperarPassword')}
            >
              <Text style={s.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          )}

          {/* toggle login/registro */}
          <TouchableOpacity
            style={{ marginTop: 12, alignItems: 'center' }}
            activeOpacity={0.7}
            onPress={() => setIsRegistro(!isRegistro)}
          >
            <Text style={s.forgotText}>
              {isRegistro
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </Text>
          </TouchableOpacity>

          {/* acceso al panel web para docentes (abre el /admin de Django) */}
          <View style={s.dividerWrapper}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>docentes</Text>
            <View style={s.dividerLine} />
          </View>
          <TouchableOpacity
            style={s.secondaryButton}
            activeOpacity={0.85}
            onPress={handleAbrirPanelDocente}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Ionicons
                name="open-outline"
                size={18}
                color={colors.primary}
              />
              <Text style={s.secondaryButtonText}>
                Soy docente · Abrir panel web
              </Text>
            </View>
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={s.footerText}>
              Facultad de Medicina · Medicina Familiar
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
