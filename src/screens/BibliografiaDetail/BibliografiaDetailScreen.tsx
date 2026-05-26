// detalle modal de una referencia bibliografica

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
import { useBibliografiaDetail } from '../../hooks/useBibliografiaDetail';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeBibliografiaDetailStyles } from './BibliografiaDetailScreen.styles';

type DetailRoute = RouteProp<RootStackParamList, 'BibliografiaDetail'>;
type DetailNav = NativeStackNavigationProp<RootStackParamList, 'BibliografiaDetail'>;

const BibliografiaDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();
  const { colors } = useTheme();
  const s = useMemo(() => makeBibliografiaDetailStyles(colors), [colors]);
  const { id } = route.params;

  const { data, loading, error, refetch } = useBibliografiaDetail(id);

  if (loading && !data) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[s.errorText, { marginTop: 12 }]}>Cargando…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={s.centered}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <Text style={[s.errorText, { marginBottom: 12, textAlign: 'center' }]}>
          {error ?? 'No se pudo cargar la referencia.'}
        </Text>
        <TouchableOpacity style={s.retryButton} onPress={refetch}>
          <Text style={s.retryText}>Reintentar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.retryButton, { backgroundColor: 'transparent', marginTop: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[s.retryText, { color: colors.primary }]}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={[s.banner, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={s.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={s.headerAccent} />
        <View style={s.metaRow}>
          {!!data.tipo && (
            <View style={s.typeBadge}>
              <Text style={s.typeBadgeText}>{data.tipo}</Text>
            </View>
          )}
          {data.anio > 0 && <Text style={s.metaText}>{data.anio}</Text>}
        </View>
        <Text style={s.title}>{data.titulo}</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {data.autores && data.autores.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Autores</Text>
            <Text style={s.body}>{data.autores.join(', ')}</Text>
          </>
        )}

        {!!data.revista && (
          <>
            <Text style={s.sectionTitle}>Publicado en</Text>
            <Text style={s.body}>{data.revista}</Text>
          </>
        )}

        {!!data.resumen && (
          <>
            <Text style={s.sectionTitle}>Resumen</Text>
            <Text style={s.body}>{data.resumen}</Text>
          </>
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

export default BibliografiaDetailScreen;
