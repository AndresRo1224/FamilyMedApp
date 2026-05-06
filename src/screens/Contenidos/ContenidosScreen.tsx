// pantalla de contenidos con filtros - lee desde el backend

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import { useContenidos } from '../../hooks/useContenidos';
import type { Contenido, ContenidoNivel } from '../../services/types';
import { contenidosStyles as s } from './ContenidosScreen.styles';

type FilterValue = ContenidoNivel | 'all';

interface FilterOption {
  value: FilterValue;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'basico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

const LEVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

// chip del filtro
interface FilterChipProps {
  option: FilterOption;
  active: boolean;
  onPress: (value: FilterValue) => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ option, active, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(option.value)}
      style={[s.chip, active ? s.chipActive : s.chipInactive]}
    >
      <Text
        style={[s.chipText, active ? s.chipTextActive : s.chipTextInactive]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

// card de seccion con animacion de stagger
interface ContentCardProps {
  contenido: Contenido;
  animValue: Animated.Value;
}

const ContentCard: React.FC<ContentCardProps> = ({ contenido, animValue }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
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
      bounciness: 5,
    }).start();
  };

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [{ translateY }, { scale }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={s.card}
      >
        <View style={s.cardHeader}>
          <View style={s.levelBadge}>
            <Text style={s.levelBadgeText}>
              {LEVEL_LABELS[contenido.nivel] ?? contenido.nivel}
            </Text>
          </View>
          <Text style={s.readingTime}>
            {contenido.tiempo_lectura_min} min
          </Text>
        </View>

        <Text style={s.cardTitle}>{contenido.titulo}</Text>
        <Text style={s.cardSubtitle} numberOfLines={2}>
          {contenido.subtitulo}
        </Text>

        <View style={s.keyPointsContainer}>
          {contenido.puntos_clave.slice(0, 2).map((point, idx) => (
            <View key={idx} style={s.keyPointRow}>
              <View style={s.keyPointDot} />
              <Text style={s.keyPointText} numberOfLines={1}>
                {point}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ContenidosScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  // datos del backend
  const { data: contenidos, loading, error, refetch } = useContenidos();

  const headerAnim = useRef(new Animated.Value(0)).current;

  // un animated value por cada item; se recalcula si la cantidad de datos cambia
  const cardAnims = useMemo(
    () => contenidos.map(() => new Animated.Value(0)),
    [contenidos],
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
          80,
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

  // filtra en el cliente segun el chip activo
  const filteredContent = useMemo(() => {
    if (activeFilter === 'all') {
      return contenidos;
    }
    return contenidos.filter((c) => c.nivel === activeFilter);
  }, [contenidos, activeFilter]);

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* banner azul */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={[s.headerBanner, { paddingTop: insets.top + 16 }]}>
          <View style={s.headerAccent} />
          <Text style={s.title}>Contenidos</Text>
          <Text style={s.subtitle}>
            Hipertensión Arterial · {filteredContent.length}{' '}
            {filteredContent.length === 1 ? 'sección' : 'secciones'}
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
              option={item}
              active={activeFilter === item.value}
              onPress={setActiveFilter}
            />
          )}
        />
      </View>

      {/* loading inicial */}
      {loading && contenidos.length === 0 ? (
        <View style={s.emptyState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[s.emptyText, { marginTop: 12 }]}>
            Cargando contenidos…
          </Text>
        </View>
      ) : error ? (
        // estado de error con boton para reintentar
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
        // listado normal
        <FlatList
          data={filteredContent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <ContentCard
              contenido={item}
              animValue={cardAnims[index] ?? new Animated.Value(1)}
            />
          )}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={s.emptyText}>
                No hay contenido para este filtro.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ContenidosScreen;
