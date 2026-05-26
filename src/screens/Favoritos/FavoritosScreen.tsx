// pantalla de favoritos: lista todo lo que el usuario marco con corazon
// agrupado por tipo, con tap para abrir el detalle correspondiente

import React, { useMemo } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import EmptyState from '../../components/EmptyState';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FavoriteEntry,
  FavoriteKind,
  useFavorites,
} from '../../contexts/FavoritesContext';
import { useHaptics } from '../../hooks/useHaptics';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type IconName = keyof typeof Ionicons.glyphMap;

const KIND_META: Record<FavoriteKind, { label: string; icon: IconName }> = {
  contenido: { label: 'Contenido', icon: 'book-outline' },
  calculadora: { label: 'Calculadora', icon: 'calculator-outline' },
  atlas: { label: 'Atlas', icon: 'images-outline' },
  guia: { label: 'Guía', icon: 'clipboard-outline' },
  bibliografia: { label: 'Bibliografía', icon: 'bookmark-outline' },
};

const FavoritosScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { favorites, toggleFavorite } = useFavorites();

  // ordena del mas reciente al mas antiguo
  const ordered = useMemo(() => {
    return [...favorites].sort((a, b) =>
      b.addedAt.localeCompare(a.addedAt),
    );
  }, [favorites]);

  const handleOpen = (item: FavoriteEntry) => {
    haptics.tap();
    switch (item.kind) {
      case 'contenido':
        navigation.navigate('ContenidoDetail', { id: item.id });
        return;
      case 'calculadora':
        navigation.navigate('CalculadoraDetail', { id: item.id });
        return;
      case 'atlas':
        navigation.navigate('AtlasDetail', { id: item.id });
        return;
      case 'guia':
        navigation.navigate('GuiaDetail', { id: item.id });
        return;
      case 'bibliografia':
        navigation.navigate('BibliografiaDetail', { id: item.id });
        return;
    }
  };

  const handleRemove = (item: FavoriteEntry) => {
    haptics.warning();
    toggleFavorite({ kind: item.kind, id: item.id, title: item.title });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* banner */}
      <View
        style={[
          styles.banner,
          { backgroundColor: colors.primary, paddingTop: insets.top + 12 },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={[styles.accent, { backgroundColor: colors.gold }]} />
        <Text style={styles.title}>Favoritos</Text>
        <Text style={styles.subtitle}>
          {ordered.length}{' '}
          {ordered.length === 1 ? 'guardado' : 'guardados'}
        </Text>
      </View>

      {ordered.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Aún no tienes favoritos"
          description="Cuando estés viendo un contenido, calculadora o guía, toca el corazón para guardarlo aquí."
        />
      ) : (
        <FlatList
          data={ordered}
          keyExtractor={(item) => `${item.kind}-${item.id}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const meta = KIND_META[item.kind];
            return (
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.cardMain}
                  onPress={() => handleOpen(item)}
                >
                  <View
                    style={[
                      styles.kindIcon,
                      { backgroundColor: colors.primary + '14' },
                    ]}
                  >
                    <Ionicons
                      name={meta.icon}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.kindLabel, { color: colors.primary }]}
                    >
                      {meta.label}
                    </Text>
                    <Text
                      style={[styles.cardTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  activeOpacity={0.7}
                  onPress={() => handleRemove(item)}
                >
                  <Ionicons
                    name="heart"
                    size={22}
                    color={colors.danger}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  accent: {
    width: 42,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kindIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kindLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  removeBtn: {
    padding: 8,
  },
});

export default FavoritosScreen;
