// pantalla de contenidos con filtros

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import {
  ContentLevel,
  HypertensionContent,
  HypertensionSection,
} from '../../data/mockData';

type FilterValue = ContentLevel | 'all';

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

const LEVEL_LABELS: Record<ContentLevel, string> = {
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
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    >
      <Text
        style={[
          styles.chipText,
          active ? styles.chipTextActive : styles.chipTextInactive,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );
};

// card de cada seccion
interface ContentCardProps {
  section: HypertensionSection;
}

const ContentCard: React.FC<ContentCardProps> = ({ section }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            {LEVEL_LABELS[section.level]}
          </Text>
        </View>
        <Text style={styles.readingTime}>
          {section.readingTimeMinutes} min
        </Text>
      </View>

      <Text style={styles.cardTitle}>{section.title}</Text>
      <Text style={styles.cardSubtitle} numberOfLines={2}>
        {section.subtitle}
      </Text>

      <View style={styles.keyPointsContainer}>
        {section.keyPoints.slice(0, 2).map((point, idx) => (
          <View key={idx} style={styles.keyPointRow}>
            <View style={styles.keyPointDot} />
            <Text style={styles.keyPointText} numberOfLines={1}>
              {point}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const ContenidosScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  // lista filtrada segun el chip activo
  const filteredContent = useMemo(() => {
    if (activeFilter === 'all') {
      return HypertensionContent;
    }
    return HypertensionContent.filter(
      (section) => section.level === activeFilter,
    );
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* header */}
      <View style={styles.header}>
        <Text style={styles.title}>Contenidos</Text>
        <Text style={styles.subtitle}>
          Hipertensión Arterial · {filteredContent.length}{' '}
          {filteredContent.length === 1 ? 'sección' : 'secciones'}
        </Text>
      </View>

      {/* filtros */}
      <View style={styles.filtersWrapper}>
        <FlatList
          data={FILTER_OPTIONS}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <FilterChip
              option={item}
              active={activeFilter === item.value}
              onPress={setActiveFilter}
            />
          )}
        />
      </View>

      {/* listado */}
      <FlatList
        data={filteredContent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ContentCard section={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No hay contenido para este filtro.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  filtersWrapper: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 12,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.border,
  },
  chipText: {
    ...Typography.label,
  },
  chipTextActive: {
    color: Colors.text,
  },
  chipTextInactive: {
    color: Colors.textSecondary,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelBadgeText: {
    ...Typography.caption,
    color: Colors.text,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  readingTime: {
    ...Typography.caption,
    color: Colors.gold,
    letterSpacing: 0.3,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 12,
  },

  keyPointsContainer: {
    marginTop: 4,
    gap: 6,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  keyPointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  keyPointText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },

  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default ContenidosScreen;
