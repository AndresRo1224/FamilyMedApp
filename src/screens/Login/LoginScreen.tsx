// pantalla de login

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
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

import { Colors } from '../../constants/colors';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { loginStyles as s } from './LoginScreen.styles';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<LoginNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // animacion de entrada
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

  // por ahora solo navega al main (sin validacion real)
  const handleLogin = () => {
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

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

        {/* formulario */}
        <Animated.View
          style={[
            s.form,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Text style={s.formTitle}>Iniciar sesión</Text>
          <Text style={s.formSubtitle}>
            Ingresa con tu cuenta institucional
          </Text>

          {/* email */}
          <View style={s.inputGroup}>
            <Text style={s.inputLabel}>Correo institucional</Text>
            <View
              style={[
                s.inputWrapper,
                emailFocused && s.inputWrapperFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={emailFocused ? Colors.primary : Colors.textTertiary}
                style={s.inputIcon}
              />
              <TextInput
                style={s.input}
                placeholder="correo@udes.edu.co"
                placeholderTextColor={Colors.textTertiary}
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
                color={passwordFocused ? Colors.primary : Colors.textTertiary}
                style={s.inputIcon}
              />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textTertiary}
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
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* olvide contraseña */}
          <TouchableOpacity style={s.forgotLink} activeOpacity={0.7}>
            <Text style={s.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* boton ingresar */}
          <TouchableOpacity
            style={s.primaryButton}
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            <Text style={s.primaryButtonText}>Ingresar</Text>
          </TouchableOpacity>

          {/* divider */}
          <View style={s.dividerWrapper}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>o</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ingresar como invitado */}
          <TouchableOpacity
            style={s.secondaryButton}
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            <Text style={s.secondaryButtonText}>Ingresar como invitado</Text>
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
