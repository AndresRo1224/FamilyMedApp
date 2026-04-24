// galeria visual con filtros

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import {
  AtlasCategories,
  AtlasCategory,
  AtlasItem,
  AtlasItems,
} from '../../data/mockData';
import { atlasStyles as s } from './AtlasScreen.styles';

type FilterValue = AtlasCategory | 'all';
type IconName = keyof typeof Ionicons.glyphMap;

// icono y color de fondo segun la categoria
const CATEGORY_VISUAL: Record<
  AtlasCategory,
  { icon: IconName; bg: string }
> = {
  fondo_ojo: { icon: 'eye', bg: '#1A3472' },
  ecg: { icon: 'pulse', bg: '#0D4D8C' },
  radiologia: { icon: 'scan', bg: '#2E6FD9' },
  tecnica_clinica: { icon: 'medkit', bg: '#004899' },
};

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
  item: AtlasItem;
  animValue: Animated.Value;
}

const AtlasCard: React.FC<AtlasCardProps> = ({ item, animValue }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const visual = CATEGORY_VISUAL[item.category];

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
        style={s.card}
      >
        {/* placeholder de imagen con icono por categoria */}
        <View style={[s.imageBox, { backgroundColor: visual.bg }]}>
          <Ionicons
            name={visual.icon}
            size={54}
            color="rgba(255, 255, 255, 0.9)"
          />
          <View style={s.categoryBadge}>
            <Text style={s.categoryBadgeText}>{item.categoryLabel}</Text>
          </View>
        </View>

        <View style={s.cardFooter}>
          <Text style={s.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={s.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AtlasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(
    AtlasItems.map(() => new Animated.Value(0)),
  ).current;

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
        70,
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

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return AtlasItems;
    }
    return AtlasItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

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
          data={AtlasCategories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersList}
          renderItem={({ item }) => (
            <FilterChip
              label={item.label}
              value={item.id}
              active={activeFilter === item.id}
              onPress={setActiveFilter}
            />
          )}
        />
      </View>

      {/* grid */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={s.gridRow}
        contentContainerStyle={s.gridContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AtlasCard
            item={item}
            animValue={cardAnims[index] ?? new Animated.Value(1)}
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
    </View>
  );
};

export default AtlasScreen;
