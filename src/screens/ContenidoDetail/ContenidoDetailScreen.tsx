// pantalla de detalle de un contenido
// llega aqui al tocar una card en la pantalla de Contenidos

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../contexts/ThemeContext';
import { useContenidoDetail } from '../../hooks/useContenidoDetail';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeContenidoDetailStyles } from './ContenidoDetailScreen.styles';

const LEVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

type DetailRoute = RouteProp<RootStackParamList, 'ContenidoDetail'>;
type DetailNav = NativeStackNavigationProp<RootStackParamList, 'ContenidoDetail'>;

const ContenidoDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();
  const { colors } = useTheme();
  const s = useMemo(() => makeContenidoDetailStyles(colors), [colors]);
  const { id } = route.params;

  const { data, loading, error, refetch } = useContenidoDetail(id);

  // loading inicial
  if (loading && !data) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[s.errorText, { marginTop: 12 }]}>Cargando…</Text>
      </View>
    );
  }

  // error con boton de reintentar
  if (error || !data) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <Text style={[s.errorText, { marginBottom: 12, textAlign: 'center' }]}>
          {error ?? 'No se pudo cargar el contenido.'}
        </Text>
        <TouchableOpacity style={s.retryButton} onPress={refetch}>
          <Text style={s.retryText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.retryButton, { backgroundColor: 'transparent', marginTop: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[s.retryText, { color: colors.primary }]}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* banner con boton X para cerrar el modal */}
      <View style={[s.banner, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={s.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={s.headerAccent} />
        <Text style={s.title}>{data.titulo}</Text>
        {!!data.subtitulo && (
          <Text style={s.subtitle}>{data.subtitulo}</Text>
        )}
        <View style={s.metaRow}>
          <View style={s.levelBadge}>
            <Text style={s.levelBadgeText}>
              {LEVEL_LABELS[data.nivel] ?? data.nivel}
            </Text>
          </View>
          <Text style={s.metaText}>{data.tiempo_lectura_min} min</Text>
          <Text style={s.metaText}>· {data.vistas ?? 0} vistas</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* cuerpo principal */}
        <Text style={s.sectionTitle}>Contenido</Text>
        <Text style={s.body}>{data.cuerpo}</Text>

        {/* puntos clave */}
        {data.puntos_clave && data.puntos_clave.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Puntos clave</Text>
            <View style={s.pointsBox}>
              {data.puntos_clave.map((p, i) => (
                <View key={i} style={s.pointRow}>
                  <View style={s.pointDot} />
                  <Text style={s.pointText}>{p}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* referencias */}
        {data.referencias && data.referencias.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Referencias</Text>
            <View style={s.refsBox}>
              {data.referencias.map((r, i) => (
                <Text key={i} style={s.refText}>
                  {i + 1}. {r}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* etiquetas */}
        {data.etiquetas && data.etiquetas.length > 0 && (
          <View style={s.tagsRow}>
            {data.etiquetas.map((t, i) => (
              <View key={i} style={s.tagChip}>
                <Text style={s.tagText}>#{t}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ContenidoDetailScreen;
