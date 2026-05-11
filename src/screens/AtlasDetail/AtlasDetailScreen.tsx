// detalle modal de una imagen del atlas

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { useAtlasDetail } from '../../hooks/useAtlasDetail';
import { buildMediaUrl } from '../../services/api';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { atlasDetailStyles as s } from './AtlasDetailScreen.styles';

type DetailRoute = RouteProp<RootStackParamList, 'AtlasDetail'>;
type DetailNav = NativeStackNavigationProp<RootStackParamList, 'AtlasDetail'>;

const CATEGORY_LABELS: Record<string, string> = {
  fondo_ojo: 'Fondo de Ojo',
  ecg: 'Electrocardiograma',
  radiologia: 'Radiología',
  tecnica_clinica: 'Técnica Clínica',
};

const AtlasDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<DetailNav>();
  const { id } = route.params;

  const { data, loading, error, refetch } = useAtlasDetail(id);
  const [imageError, setImageError] = useState(false);

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
          {error ?? 'No se pudo cargar la imagen.'}
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

  const imageUri = !imageError ? buildMediaUrl(data.imagen_url) : null;
  const categoria = CATEGORY_LABELS[data.categoria] ?? data.categoria;

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
        <View style={s.categoryBadge}>
          <Text style={s.categoryBadgeText}>{categoria}</Text>
        </View>
        <Text style={s.title}>{data.titulo}</Text>
        <Text style={s.metaText}>{data.vistas ?? 0} vistas</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* imagen grande o placeholder */}
        <View style={s.imageBox}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={s.image}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={s.placeholderBox}>
              <Ionicons name="image-outline" size={64} color={Colors.textTertiary} />
              <Text style={s.placeholderText}>Imagen no disponible</Text>
            </View>
          )}
        </View>

        {!!data.descripcion && (
          <>
            <Text style={s.sectionTitle}>Descripción</Text>
            <Text style={s.body}>{data.descripcion}</Text>
          </>
        )}

        {data.hallazgos && data.hallazgos.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Hallazgos</Text>
            <View style={s.listBox}>
              {data.hallazgos.map((h, i) => (
                <View key={i} style={s.row}>
                  <View style={s.dot} />
                  <Text style={s.rowText}>{h}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {!!data.significancia_clinica && (
          <>
            <Text style={s.sectionTitle}>Significancia clínica</Text>
            <View style={s.clinicalBox}>
              <Text style={s.clinicalText}>{data.significancia_clinica}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AtlasDetailScreen;
