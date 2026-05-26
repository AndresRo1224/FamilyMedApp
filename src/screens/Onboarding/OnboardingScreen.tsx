// pantalla de onboarding: 3 slides la primera vez que se abre la app
// guarda un flag en AsyncStorage para no repetirla

import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../contexts/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

const { width } = Dimensions.get('window');

export const ONBOARDING_KEY = 'familymed-onboarding-done-v1';

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    icon: 'medkit',
    title: 'Medicina familiar al alcance',
    description:
      'Contenidos clínicos sobre hipertensión arterial, organizados por nivel y curados para tu formación.',
  },
  {
    icon: 'calculator',
    title: 'Calculadoras y guías clínicas',
    description:
      'Herramientas de uso diario: scores, fórmulas, algoritmos y protocolos basados en evidencia.',
  },
  {
    icon: 'school',
    title: 'Estudia y consulta donde sea',
    description:
      'Atlas visual, bibliografía y búsqueda global. Marca tus favoritos y vuelve cuando lo necesites.',
  },
];

interface OnboardingScreenProps {
  onDone: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onDone }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    haptics.tap();
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const finish = async () => {
    haptics.success();
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      // no-op: si falla la persistencia se vera otra vez, no es critico
    }
    onDone();
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
  ).current;

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* skip arriba a la derecha */}
      <TouchableOpacity
        style={[styles.skip, { top: insets.top + 12 }]}
        onPress={finish}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(_, i) => `s-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={colors.primary} />
            </View>
            <View style={styles.accent} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        )}
      />

      {/* dots */}
      <View style={[styles.dots, { paddingBottom: insets.bottom + 90 }]}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View
        style={[
          styles.ctaWrapper,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={styles.cta}
        >
          <Text style={[styles.ctaText, { color: colors.primary }]}>
            {isLast ? 'Comenzar' : 'Siguiente'}
          </Text>
          <Ionicons
            name={isLast ? 'checkmark' : 'arrow-forward'}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  skip: {
    position: 'absolute',
    right: 18,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    opacity: 0.85,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  accent: {
    width: 48,
    height: 4,
    backgroundColor: '#C99F81',
    borderRadius: 2,
    marginTop: 28,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 22,
  },
  ctaWrapper: {
    paddingHorizontal: 28,
  },
  cta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  ctaText: {
    fontWeight: '800',
    fontSize: 16,
  },
});

export default OnboardingScreen;
