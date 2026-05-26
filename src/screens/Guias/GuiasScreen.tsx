// pantalla de guias clinicas - lee desde el backend

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SkeletonList } from '../../components/Skeleton';
import { useTheme } from '../../contexts/ThemeContext';
import { useGuias } from '../../hooks/useGuias';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { Guia, GuiaTipo } from '../../services/types';
import { makeGuiasStyles } from './GuiasScreen.styles';

type GuiasNav = NativeStackNavigationProp<RootStackParamList>;

type FilterValue = GuiaTipo | 'all';

interface FilterOption {
  value: FilterValue;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todas' },
  { value: 'algoritmo', label: 'Algoritmos' },
  { value: 'protocolo', label: 'Protocolos' },
  { value: 'tecnica', label: 'Técnicas' },
  { value: 'situacion_especial', label: 'Situaciones' },
];

// labels legibles del tipo
const TYPE_LABELS: Record<string, string> = {
  algoritmo: 'Algoritmo',
  protocolo: 'Protocolo',
  tecnica: 'Técnica',
  situacion_especial: 'Situación Especial',
};

// chip de filtro
interface FilterChipProps {
  option: FilterOption;
  active: boolean;
  onPress: (value: FilterValue) => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ option, active, onPress }) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeGuiasStyles(colors), [colors]);
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

// card con animacion (stagger + press scale)
interface GuideCardProps {
  guia: Guia;
  animValue: Animated.Value;
  onPress: (id: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guia, animValue, onPress }) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeGuiasStyles(colors), [colors]);
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
        onPress={() => onPress(guia.id)}
        style={s.card}
      >
        <View style={s.cardHeader}>
          <View style={s.typeBadge}>
            <Text style={s.typeBadgeText}>
              {TYPE_LABELS[guia.tipo] ?? guia.tipo}
            </Text>
          </View>
          <Text style={s.lastUpdated}>{guia.ultima_actualizacion}</Text>
        </View>

        <Text style={s.cardTitle}>{guia.titulo}</Text>
        <Text style={s.cardSummary} numberOfLines={3}>
          {guia.resumen}
        </Text>

        <View style={s.stepsContainer}>
          {guia.pasos.slice(0, 3).map((step, idx) => (
            <View key={idx} style={s.stepRow}>
              <Text style={s.stepNumber}>{idx + 1}.</Text>
              <Text style={s.stepText} numberOfLines={2}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        <Text style={s.sourceText} numberOfLines={1}>
          Fuente: {guia.fuente}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const GuiasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<GuiasNav>();
  const { colors } = useTheme();
  const s = useMemo(() => makeGuiasStyles(colors), [colors]);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const { data: guias, loading, error, refetch } = useGuias();

  const goToDetail = useCallback(
    (id: string) => navigation.navigate('GuiaDetail', { id }),
    [navigation],
  );

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useMemo(
    () => guias.map(() => new Animated.Value(0)),
    [guias],
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

  const filteredGuides = useMemo(() => {
    if (activeFilter === 'all') {
      return guias;
    }
    return guias.filter((g) => g.tipo === activeFilter);
  }, [guias, activeFilter]);

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* banner azul */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={[s.headerBanner, { paddingTop: insets.top + 16 }]}>
          <View style={s.headerAccent} />
          <Text style={s.title}>Guías</Text>
          <Text style={s.subtitle}>
            {filteredGuides.length}{' '}
            {filteredGuides.length === 1 ? 'guía' : 'guías'} clínicas
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

      {/* loading / error / lista */}
      {loading && guias.length === 0 ? (
        <SkeletonList count={4} variant="content" />
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
          data={filteredGuides}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && guias.length > 0}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <GuideCard
              guia={item}
              animValue={cardAnims[index] ?? new Animated.Value(1)}
              onPress={goToDetail}
            />
          )}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={s.emptyText}>No hay guías para este filtro.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default GuiasScreen;
