// galeria visual con filtros - lee desde el backend

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Skeleton } from '../../components/Skeleton';
import { useTheme } from '../../contexts/ThemeContext';
import { useAtlas } from '../../hooks/useAtlas';
import { buildMediaUrl } from '../../services/api';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { AtlasCategoria, AtlasImagen } from '../../services/types';
import { makeAtlasStyles } from './AtlasScreen.styles';

type AtlasNav = NativeStackNavigationProp<RootStackParamList>;

type FilterValue = AtlasCategoria | 'all';
type IconName = keyof typeof Ionicons.glyphMap;

// labels legibles para cada categoria
const CATEGORY_LABELS: Record<string, string> = {
  fondo_ojo: 'Fondo de Ojo',
  ecg: 'Electrocardiograma',
  radiologia: 'Radiología',
  tecnica_clinica: 'Técnica Clínica',
};

// icono y color de fondo por categoria
const CATEGORY_VISUAL: Record<string, { icon: IconName; bg: string }> = {
  fondo_ojo: { icon: 'eye', bg: '#1A3472' },
  ecg: { icon: 'pulse', bg: '#0D4D8C' },
  radiologia: { icon: 'scan', bg: '#2E6FD9' },
  tecnica_clinica: { icon: 'medkit', bg: '#004899' },
};

// opciones del filtro
const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'fondo_ojo', label: 'Fondo de Ojo' },
  { value: 'ecg', label: 'Electrocardiograma' },
  { value: 'radiologia', label: 'Radiología' },
  { value: 'tecnica_clinica', label: 'Técnica Clínica' },
];

// chip de filtro
interface FilterChipProps {
  label: string;
  value: FilterValue;
  active: boolean;
  onPress: (value: FilterValue) => void;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  value,
  active,
  onPress,
}) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeAtlasStyles(colors), [colors]);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(value)}
      style={[s.chip, active ? s.chipActive : s.chipInactive]}
    >
      <Text
        style={[s.chipText, active ? s.chipTextActive : s.chipTextInactive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// card del grid con animacion
interface AtlasCardProps {
  item: AtlasImagen;
  animValue: Animated.Value;
  onPress: (id: string) => void;
}

const AtlasCard: React.FC<AtlasCardProps> = ({ item, animValue, onPress }) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeAtlasStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(1)).current;
  const [imageError, setImageError] = useState(false);
  const visual = CATEGORY_VISUAL[item.categoria] ?? {
    icon: 'image' as IconName,
    bg: colors.primary,
  };
  const categoryLabel = CATEGORY_LABELS[item.categoria] ?? item.categoria;

  // si imagen_url tiene algo y no fallo la carga, mostramos la imagen real
  const imageUri = !imageError ? buildMediaUrl(item.imagen_url) : null;
  const hasImage = imageUri !== null;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View
      style={{
        width: '48%',
        opacity: animValue,
        transform: [{ translateY }, { scale }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={() => onPress(item.id)}
        style={s.card}
      >
        {/* imagen real si existe; si no, placeholder con icono por categoria */}
        <View style={[s.imageBox, { backgroundColor: visual.bg }]}>
          {hasImage ? (
            <Image
              source={{ uri: imageUri as string }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Ionicons
              name={visual.icon}
              size={54}
              color="rgba(255, 255, 255, 0.9)"
            />
          )}
          <View style={s.categoryBadge}>
            <Text style={s.categoryBadgeText}>{categoryLabel}</Text>
          </View>
        </View>

        <View style={s.cardFooter}>
          <Text style={s.cardTitle} numberOfLines={2}>
            {item.titulo}
          </Text>
          <Text style={s.cardDescription} numberOfLines={2}>
            {item.descripcion}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AtlasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AtlasNav>();
  const { colors } = useTheme();
  const s = useMemo(() => makeAtlasStyles(colors), [colors]);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const { data: imagenes, loading, error, refetch } = useAtlas();

  const goToDetail = useCallback(
    (id: string) => navigation.navigate('AtlasDetail', { id }),
    [navigation],
  );

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useMemo(
    () => imagenes.map(() => new Animated.Value(0)),
    [imagenes],
  );

  useFocusEffect(
    useCallback(() => {
      headerAnim.setValue(0);
      cardAnims.forEach((a) => a.setValue(0));

      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      if (cardAnims.length > 0) {
        Animated.stagger(
          70,
          cardAnims.map((a) =>
            Animated.timing(a, {
              toValue: 1,
              duration: 380,
              useNativeDriver: true,
            }),
          ),
        ).start();
      }
    }, [headerAnim, cardAnims]),
  );

  // filtro en cliente por categoria
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return imagenes;
    }
    return imagenes.filter((item) => item.categoria === activeFilter);
  }, [imagenes, activeFilter]);

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* banner */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={[s.headerBanner, { paddingTop: insets.top + 16 }]}>
          <View style={s.headerAccent} />
          <Text style={s.title}>Atlas</Text>
          <Text style={s.subtitle}>
            Galería visual · {filteredItems.length}{' '}
            {filteredItems.length === 1 ? 'ítem' : 'ítems'}
          </Text>
        </View>
      </Animated.View>

      {/* filtros */}
      <View style={s.filtersWrapper}>
        <FlatList
          data={FILTER_OPTIONS}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersList}
          renderItem={({ item }) => (
            <FilterChip
              label={item.label}
              value={item.value}
              active={activeFilter === item.value}
              onPress={setActiveFilter}
            />
          )}
        />
      </View>

      {/* loading o error o grid */}
      {loading && imagenes.length === 0 ? (
        <View style={s.gridContent}>
          <View style={s.gridRow}>
            {[0, 1].map((i) => (
              <View key={i} style={{ width: '48%' }}>
                <Skeleton width="100%" height={140} borderRadius={12} />
                <Skeleton width="85%" height={14} style={{ marginTop: 10 }} />
                <Skeleton width="65%" height={12} style={{ marginTop: 6 }} />
              </View>
            ))}
          </View>
          <View style={[s.gridRow, { marginTop: 16 }]}>
            {[0, 1].map((i) => (
              <View key={i} style={{ width: '48%' }}>
                <Skeleton width="100%" height={140} borderRadius={12} />
                <Skeleton width="85%" height={14} style={{ marginTop: 10 }} />
                <Skeleton width="65%" height={12} style={{ marginTop: 6 }} />
              </View>
            ))}
          </View>
        </View>
      ) : error ? (
        <View style={s.emptyState}>
          <Text style={[s.emptyText, { marginBottom: 12, textAlign: 'center' }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[s.chip, s.chipActive]}
            onPress={refetch}
            activeOpacity={0.85}
          >
            <Text style={[s.chipText, s.chipTextActive]}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={s.gridRow}
          contentContainerStyle={s.gridContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && imagenes.length > 0}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <AtlasCard
              item={item}
              animValue={cardAnims[index] ?? new Animated.Value(1)}
              onPress={goToDetail}
            />
          )}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={s.emptyText}>
                No hay imágenes para este filtro.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default AtlasScreen;
