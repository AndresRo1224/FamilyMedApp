// pantalla de bibliografia con buscador - lee desde el backend

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import EmptyState from '../../components/EmptyState';
import { SkeletonList } from '../../components/Skeleton';
import { useTheme } from '../../contexts/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { useBibliografia } from '../../hooks/useBibliografia';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { BibliografiaItem } from '../../services/types';
import { makeBibliografiaStyles } from './BibliografiaScreen.styles';

type BiblioNav = NativeStackNavigationProp<RootStackParamList>;

// card de referencia bibliografica con animacion
interface RefCardProps {
  item: BibliografiaItem;
  animValue: Animated.Value;
  onPress: (id: string) => void;
}

const RefCard: React.FC<RefCardProps> = ({ item, animValue, onPress }) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeBibliografiaStyles(colors), [colors]);
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
      style={{ opacity: animValue, transform: [{ translateY }, { scale }] }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={() => onPress(item.id)}
        style={s.card}
      >
        <View style={s.cardHeader}>
          {!!item.tipo && (
            <View style={s.typeBadge}>
              <Text style={s.typeBadgeText}>{item.tipo}</Text>
            </View>
          )}
          {item.anio > 0 && <Text style={s.year}>{item.anio}</Text>}
        </View>

        <Text style={s.cardTitle}>{item.titulo}</Text>
        {item.autores.length > 0 && (
          <Text style={s.authors} numberOfLines={2}>
            {item.autores.join(', ')}
          </Text>
        )}
        {!!item.revista && (
          <Text style={s.journal} numberOfLines={1}>
            {item.revista}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const BibliografiaScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BiblioNav>();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const s = useMemo(() => makeBibliografiaStyles(colors), [colors]);
  const [search, setSearch] = useState('');

  const { data: items, loading, error, refetch } = useBibliografia();

  const goToDetail = useCallback(
    (id: string) => {
      haptics.tap();
      navigation.navigate('BibliografiaDetail', { id });
    },
    [haptics, navigation],
  );

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useMemo(
    () => items.map(() => new Animated.Value(0)),
    [items],
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

  // filtro por texto: titulo, autores, revista o etiquetas
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const inTitulo = it.titulo.toLowerCase().includes(q);
      const inAutores = it.autores.some((a) => a.toLowerCase().includes(q));
      const inRevista = (it.revista || '').toLowerCase().includes(q);
      const inTags = (it.etiquetas || []).some((t) =>
        t.toLowerCase().includes(q),
      );
      return inTitulo || inAutores || inRevista || inTags;
    });
  }, [items, search]);

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={[s.headerBanner, { paddingTop: insets.top + 16 }]}>
          <View style={s.headerAccent} />
          <Text style={s.title}>Bibliografía</Text>
          <Text style={s.subtitle}>
            {filtered.length}{' '}
            {filtered.length === 1 ? 'referencia' : 'referencias'}
          </Text>
        </View>
      </Animated.View>

      {/* buscador */}
      <View style={s.searchWrapper}>
        <View style={s.searchBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textTertiary}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar por título, autor o revista…"
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && items.length === 0 ? (
        <SkeletonList count={5} variant="compact" />
      ) : error ? (
        <View style={s.emptyState}>
          <Text style={[s.emptyText, { marginBottom: 12, textAlign: 'center' }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
            }}
            onPress={refetch}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && items.length > 0}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <RefCard
              item={item}
              animValue={cardAnims[index] ?? new Animated.Value(1)}
              onPress={goToDetail}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title="Sin referencias"
              description={
                search.trim().length > 0
                  ? `Nada coincide con "${search.trim()}".`
                  : 'Aún no hay referencias publicadas.'
              }
            />
          }
        />
      )}
    </View>
  );
};

export default BibliografiaScreen;
