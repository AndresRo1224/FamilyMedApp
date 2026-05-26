// pantalla para editar el perfil del usuario (nombre, cedula, institucion, codigo)

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
import { makeEditarPerfilStyles } from './EditarPerfilScreen.styles';

type EditarPerfilNav = NativeStackNavigationProp<
  RootStackParamList,
  'EditarPerfil'
>;

const EditarPerfilScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<EditarPerfilNav>();
  const { user, updateProfile } = useAuth();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { showToast } = useToast();
  const s = useMemo(() => makeEditarPerfilStyles(colors), [colors]);

  const [nombre, setNombre] = useState(user?.nombre_completo || '');
  const [cedula, setCedula] = useState((user as { cedula?: string })?.cedula || '');
  const [institucion, setInstitucion] = useState(user?.institucion || '');
  const [codigo, setCodigo] = useState(user?.codigo_programa || '');

  const [loading, setLoading] = useState(false);

  // valida y manda los cambios
  const handleGuardar = async () => {
    const n = nombre.trim();
    if (!n) {
      haptics.warning();
      showToast('El nombre completo es obligatorio', 'error');
      return;
    }
    if (n.length > 120) {
      haptics.warning();
      showToast('Nombre muy largo (máximo 120 caracteres)', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateProfile({
        nombre_completo: n,
        cedula: cedula.trim(),
        institucion: institucion.trim(),
        codigo_programa: codigo.trim(),
      });
      haptics.success();
      showToast('Perfil actualizado', 'success');
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      haptics.error();
      showToast(`No se pudo guardar: ${msg}`, 'error');
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

      {/* banner con boton back */}
      <View style={[s.banner, { paddingTop: insets.top + 10 }]}>
        <View style={s.bannerRow}>
          <TouchableOpacity
            style={s.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.bannerTitle}>Editar perfil</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* aviso: el correo no se edita */}
        <View style={s.infoBox}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.textTertiary}
            style={{ marginRight: 8 }}
          />
          <Text style={s.infoText}>
            Tu correo ({user?.correo}) no se puede cambiar.
          </Text>
        </View>

        {/* nombre */}
        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Nombre completo</Text>
          <View style={s.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={s.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre completo"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* cedula */}
        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Cédula</Text>
          <View style={s.inputWrapper}>
            <Ionicons
              name="card-outline"
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={s.input}
              value={cedula}
              onChangeText={setCedula}
              placeholder="Número de documento"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* institucion */}
        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Institución</Text>
          <View style={s.inputWrapper}>
            <Ionicons
              name="school-outline"
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={s.input}
              value={institucion}
              onChangeText={setInstitucion}
              placeholder="Universidad o institución"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        {/* codigo del programa */}
        <View style={s.inputGroup}>
          <Text style={s.inputLabel}>Código del programa</Text>
          <View style={s.inputWrapper}>
            <Ionicons
              name="barcode-outline"
              size={18}
              color={colors.textTertiary}
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={s.input}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="Ej: 65-2026-071"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[s.primaryButton, loading && { opacity: 0.6 }]}
          activeOpacity={0.85}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={s.primaryButtonText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditarPerfilScreen;
