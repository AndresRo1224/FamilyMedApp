// busqueda global: un solo input que busca en contenidos, calculadoras,
// atlas, guias y bibliografia. Agrupa por tipo y abre el detalle al tocar.

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import EmptyState from '../../components/EmptyState';
import { useTheme } from '../../contexts/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { useContenidos } from '../../hooks/useContenidos';
import { useCalculadoras } from '../../hooks/useCalculadoras';
import { useAtlas } from '../../hooks/useAtlas';
import { useGuias } from '../../hooks/useGuias';
import { useBibliografia } from '../../hooks/useBibliografia';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type ResultKind =
  | 'contenido'
  | 'calculadora'
  | 'atlas'
  | 'guia'
  | 'bibliografia';

interface SearchResult {
  kind: ResultKind;
  id: string;
  title: string;
  subtitle?: string;
}

const KIND_META: Record<
  ResultKind,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  contenido: { label: 'Contenido', icon: 'book-outline' },
  calculadora: { label: 'Calculadora', icon: 'calculator-outline' },
  atlas: { label: 'Atlas', icon: 'images-outline' },
  guia: { label: 'Guía', icon: 'clipboard-outline' },
  bibliografia: { label: 'Bibliografía', icon: 'bookmark-outline' },
};

// se carga toda la data desde cache de react-query (instantaneo)
const BusquedaScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const [q, setQ] = useState('');

  const { data: contenidos } = useContenidos();
  const { data: calculadoras } = useCalculadoras();
  const { data: atlas } = useAtlas();
  const { data: guias } = useGuias();
  const { data: bibliografia } = useBibliografia();

  // filtra todo en cliente sobre la cache de react-query
  const results: SearchResult[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];

    const matches: SearchResult[] = [];

    const has = (s: string | undefined | null) =>
      !!s && s.toLowerCase().includes(query);
    const anyTag = (tags: string[] | undefined) =>
      (tags || []).some((t) => t.toLowerCase().includes(query));

    contenidos.forEach((c) => {
      if (has(c.titulo) || has(c.subtitulo) || anyTag(c.etiquetas)) {
        matches.push({
          kind: 'contenido',
          id: c.id,
          title: c.titulo,
          subtitle: c.subtitulo,
        });
      }
    });
    calculadoras.forEach((c) => {
      if (has(c.nombre) || has(c.nombre_corto) || has(c.descripcion) || anyTag(c.etiquetas)) {
        matches.push({
          kind: 'calculadora',
          id: c.id,
          title: c.nombre,
          subtitle: c.descripcion,
        });
      }
    });
    atlas.forEach((a) => {
      if (has(a.titulo) || has(a.descripcion)) {
        matches.push({
          kind: 'atlas',
          id: a.id,
          title: a.titulo,
          subtitle: a.descripcion,
        });
      }
    });
    guias.forEach((g) => {
      if (has(g.titulo) || has(g.resumen) || anyTag(g.etiquetas)) {
        matches.push({
          kind: 'guia',
          id: g.id,
          title: g.titulo,
          subtitle: g.resumen,
        });
      }
    });
    bibliografia.forEach((b) => {
      const inAutores = b.autores.some((a) => a.toLowerCase().includes(query));
      if (has(b.titulo) || has(b.revista) || inAutores || anyTag(b.etiquetas)) {
        matches.push({
          kind: 'bibliografia',
          id: b.id,
          title: b.titulo,
          subtitle: b.autores.slice(0, 3).join(', '),
        });
      }
    });

    return matches;
  }, [q, contenidos, calculadoras, atlas, guias, bibliografia]);

  const handleOpen = (item: SearchResult) => {
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
        <Text style={styles.title}>Búsqueda</Text>
        <Text style={styles.subtitleBanner}>
          Busca en todos los módulos a la vez
        </Text>
      </View>

      {/* input */}
      <View style={styles.searchWrap}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textTertiary}
          />
          <TextInput
            autoFocus
            style={[styles.input, { color: colors.text }]}
            placeholder="Buscar por título, autor, tema…"
            placeholderTextColor={colors.textTertiary}
            value={q}
            onChangeText={setQ}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {q.length > 0 && (
            <TouchableOpacity onPress={() => setQ('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* resultados o estados */}
      {q.trim().length < 2 ? (
        <EmptyState
          icon="search-outline"
          title="Escribe para buscar"
          description="Mínimo 2 letras. Buscamos en contenidos, calculadoras, atlas, guías y bibliografía."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="Sin resultados"
          description={`No encontramos nada para "${q.trim()}". Intenta con otra palabra clave.`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.kind}-${item.id}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const meta = KIND_META[item.kind];
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleOpen(item)}
                style={[
                  styles.row,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: colors.primary + '14' },
                  ]}
                >
                  <Ionicons name={meta.icon} size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.kindLabel, { color: colors.primary }]}>
                    {meta.label}
                  </Text>
                  <Text
                    style={[styles.rowTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text
                      style={[styles.rowSub, { color: colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {item.subtitle}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
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
  subtitleBanner: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15,
  },
  list: {
    padding: 20,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kindLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  rowSub: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
});

export default BusquedaScreen;
