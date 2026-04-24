// pantalla de guias clinicas

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
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
import {
  ClinicalGuide,
  ClinicalGuides,
  GuideType,
} from '../../data/mockData';
import { guiasStyles as s } from './GuiasScreen.styles';

type FilterValue = GuideType | 'all';

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

// chip de filtro
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

// card con animacion (stagger + press scale)
interface GuideCardProps {
  guide: ClinicalGuide;
  animValue: Animated.Value;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, animValue }) => {
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
          <View style={s.typeBadge}>
            <Text style={s.typeBadgeText}>{guide.typeLabel}</Text>
          </View>
          <Text style={s.lastUpdated}>{guide.lastUpdated}</Text>
        </View>

        <Text style={s.cardTitle}>{guide.title}</Text>
        <Text style={s.cardSummary} numberOfLines={3}>
          {guide.summary}
        </Text>

        <View style={s.stepsContainer}>
          {guide.steps.slice(0, 3).map((step, idx) => (
            <View key={idx} style={s.stepRow}>
              <Text style={s.stepNumber}>{idx + 1}.</Text>
              <Text style={s.stepText} numberOfLines={2}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        <Text style={s.sourceText} numberOfLines={1}>
          Fuente: {guide.source}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const GuiasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  // animaciones de entrada
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(
    ClinicalGuides.map(() => new Animated.Value(0)),
  ).current;

  // se dispara cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      headerAnim.setValue(0);
      cardAnims.forEach((a) => a.setValue(0));

      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

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
    }, [headerAnim, cardAnims]),
  );

  const filteredGuides = useMemo(() => {
    if (activeFilter === 'all') {
      return ClinicalGuides;
    }
    return ClinicalGuides.filter((g) => g.type === activeFilter);
  }, [activeFilter]);

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* banner azul */}
      <Animated.View
        style={{ opacity: headerAnim, transform: [{ translateY: headerTranslate }] }}
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

      {/* lista */}
      <FlatList
        data={filteredGuides}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <GuideCard
            guide={item}
            animValue={cardAnims[index] ?? new Animated.Value(1)}
          />
        )}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>No hay guías para este filtro.</Text>
          </View>
        }
      />
    </View>
  );
};

export default GuiasScreen;
