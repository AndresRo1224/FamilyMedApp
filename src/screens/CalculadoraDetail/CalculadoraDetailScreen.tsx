// detalle modal de una calculadora clinica

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
import { useCalculadoraDetail } from '../../hooks/useCalculadoraDetail';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { calculadoraDetailStyles as s } from './CalculadoraDetailScreen.styles';

type DetailRoute = RouteProp<RootStackParamList, 'CalculadoraDetail'>;
type DetailNav = NativeStackNavigationProp<RootStackParamList, 'CalculadoraDetail'>;

const CalculadoraDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();
  const { id } = route.params;

  const { data, loading, error, refetch } = useCalculadoraDetail(id);

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
          {error ?? 'No se pudo cargar la calculadora.'}
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
        <View style={s.shortBadge}>
          <Text style={s.shortBadgeText}>{data.nombre_corto}</Text>
        </View>
        <Text style={s.title}>{data.nombre}</Text>
        {!!data.descripcion && (
          <Text style={s.subtitle}>{data.descripcion}</Text>
        )}
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!!data.proposito && (
          <>
            <Text style={s.sectionTitle}>Propósito</Text>
            <Text style={s.body}>{data.proposito}</Text>
          </>
        )}

        <Text style={s.sectionTitle}>Fórmula</Text>
        <View style={s.formulaBox}>
          <Text style={s.formulaText}>{data.formula}</Text>
        </View>

        {data.parametros && data.parametros.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Parámetros</Text>
            <View style={s.listBox}>
              {data.parametros.map((p, i) => (
                <View key={i} style={s.row}>
                  <View style={s.dot} />
                  <Text style={s.rowText}>{p}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {!!data.unidad_salida && (
          <>
            <Text style={s.sectionTitle}>Resultado</Text>
            <View style={s.outputBox}>
              <Text style={s.outputText}>{data.unidad_salida}</Text>
            </View>
          </>
        )}

        {!!data.uso_clinico && (
          <>
            <Text style={s.sectionTitle}>Uso clínico</Text>
            <Text style={s.body}>{data.uso_clinico}</Text>
          </>
        )}

        {!!data.referencia && (
          <Text style={s.reference}>Referencia: {data.referencia}</Text>
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

export default CalculadoraDetailScreen;
