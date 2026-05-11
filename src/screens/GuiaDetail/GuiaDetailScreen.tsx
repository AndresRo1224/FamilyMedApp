// detalle modal de una guia clinica

import React from 'react';
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

import { Colors } from '../../constants/colors';
import { useGuiaDetail } from '../../hooks/useGuiaDetail';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { guiaDetailStyles as s } from './GuiaDetailScreen.styles';

type DetailRoute = RouteProp<RootStackParamList, 'GuiaDetail'>;
type DetailNav = NativeStackNavigationProp<RootStackParamList, 'GuiaDetail'>;

const TYPE_LABELS: Record<string, string> = {
  algoritmo: 'Algoritmo',
  protocolo: 'Protocolo',
  tecnica: 'Técnica',
  situacion_especial: 'Situación Especial',
};

const GuiaDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();
  const { id } = route.params;

  const { data, loading, error, refetch } = useGuiaDetail(id);

  if (loading && !data) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={[s.errorText, { marginTop: 12 }]}>Cargando…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <Text style={[s.errorText, { marginBottom: 12, textAlign: 'center' }]}>
          {error ?? 'No se pudo cargar la guía.'}
        </Text>
        <TouchableOpacity style={s.retryButton} onPress={refetch}>
          <Text style={s.retryText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.retryButton, { backgroundColor: 'transparent', marginTop: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[s.retryText, { color: Colors.primary }]}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[s.banner, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={s.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={s.headerAccent} />
        <View style={s.typeBadge}>
          <Text style={s.typeBadgeText}>
            {TYPE_LABELS[data.tipo] ?? data.tipo}
          </Text>
        </View>
        <Text style={s.title}>{data.titulo}</Text>
        {!!data.ultima_actualizacion && (
          <Text style={s.metaText}>
            Actualizada: {data.ultima_actualizacion}
          </Text>
        )}
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!!data.resumen && (
          <>
            <Text style={s.sectionTitle}>Resumen</Text>
            <Text style={s.body}>{data.resumen}</Text>
          </>
        )}

        {data.pasos && data.pasos.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Pasos</Text>
            <View style={s.stepsBox}>
              {data.pasos.map((paso, i) => (
                <View key={i} style={s.stepRow}>
                  <View style={s.stepNumber}>
                    <Text style={s.stepNumberText}>{i + 1}</Text>
                  </View>
                  <Text style={s.stepText}>{paso}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {data.advertencias && data.advertencias.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Advertencias</Text>
            <View style={s.warningBox}>
              {data.advertencias.map((adv, i) => (
                <View key={i} style={s.warningRow}>
                  <Ionicons
                    name="warning-outline"
                    size={16}
                    color="#dc2626"
                    style={{ marginRight: 8, marginTop: 3 }}
                  />
                  <Text style={s.warningText}>{adv}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {!!data.fuente && (
          <Text style={s.source}>Fuente: {data.fuente}</Text>
        )}

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

export default GuiaDetailScreen;
