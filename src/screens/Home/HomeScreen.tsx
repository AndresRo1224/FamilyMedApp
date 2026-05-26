// pantalla principal - los counts de cada modulo vienen del backend

import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { useContenidos } from '../../hooks/useContenidos';
import { useCalculadoras } from '../../hooks/useCalculadoras';
import { useAtlas } from '../../hooks/useAtlas';
import { useGuias } from '../../hooks/useGuias';
import { useBibliografia } from '../../hooks/useBibliografia';
import type { TabParamList } from '../../navigation/TabNavigator';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { makeHomeStyles } from './HomeScreen.styles';

// items recientes que mostramos en el carrusel del home
// los armamos a partir de los contenidos/guias/atlas mas recientes del backend
type RecentModule = 'contenido' | 'calculadora' | 'atlas' | 'guia';

interface RecentItem {
  id: string;
  originalId: string;
  module: RecentModule;
  title: string;
  moduleLabel: string;
  accessedAt: string;
}

// devuelve "Buenos dias", "Buenas tardes" o "Buenas noches" segun la hora
function saludoPorHora(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

// navegacion combinada: tabs + stack (para ir a Settings)
type HomeNavigationProp = BottomTabNavigationProp<TabParamList> &
  NativeStackNavigationProp<RootStackParamList>;

// modulo del grid del home
interface HomeModule {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  route: keyof TabParamList;
}

// card de modulo con animacion de stagger y scale al presionar
interface ModuleCardProps {
  module: HomeModule;
  animValue: Animated.Value;
  onPress: (module: HomeModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  animValue,
  onPress,
}) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeHomeStyles(colors), [colors]);
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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
    outputRange: [30, 0],
  });

  return (
    <Animated.View
      style={{
        width: '48%',
        marginBottom: 14,
        opacity: animValue,
        transform: [{ translateY }, { scale }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={pressIn}
        onPressOut={pressOut}
        onPress={() => onPress(module)}
        style={s.moduleCard}
      >
        <View style={s.moduleAccent} />
        <Text style={s.moduleTitle}>{module.title}</Text>
        <Text style={s.moduleDescription} numberOfLines={2}>
          {module.description}
        </Text>
        <Text style={s.moduleCount}>
          {module.itemCount} {module.itemCount === 1 ? 'ítem' : 'ítems'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// card de item reciente con animacion + tap navegacional
interface RecentCardProps {
  item: RecentItem;
  animValue: Animated.Value;
  onPress: (item: RecentItem) => void;
}

const RecentCard: React.FC<RecentCardProps> = ({ item, animValue, onPress }) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeHomeStyles(colors), [colors]);
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <Animated.View
      style={{ opacity: animValue, transform: [{ translateX }] }}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(item)}
        style={s.recentCard}
      >
        <Text style={s.recentModule}>{item.moduleLabel}</Text>
        <Text style={s.recentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={s.recentDate}>{item.accessedAt}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const s = useMemo(() => makeHomeStyles(colors), [colors]);

  // counts en vivo desde el backend
  const { data: contenidos } = useContenidos();
  const { data: calculadoras } = useCalculadoras();
  const { data: atlas } = useAtlas();
  const { data: guias } = useGuias();
  const { data: bibliografia } = useBibliografia();

  // armamos los "recientes" a partir de los datos reales del backend
  // tomamos lo mas reciente de cada modulo para que se vea movido
  const recentItems: RecentItem[] = useMemo(() => {
    const formatear = (iso: string | undefined): string => {
      if (!iso) return '';
      try {
        return new Date(iso).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
        });
      } catch {
        return '';
      }
    };

    const items: RecentItem[] = [];
    if (contenidos[0]) {
      items.push({
        id: `c-${contenidos[0].id}`,
        originalId: contenidos[0].id,
        module: 'contenido',
        title: contenidos[0].titulo,
        moduleLabel: 'Contenidos',
        accessedAt: formatear(contenidos[0].creado_en),
      });
    }
    if (guias[0]) {
      items.push({
        id: `g-${guias[0].id}`,
        originalId: guias[0].id,
        module: 'guia',
        title: guias[0].titulo,
        moduleLabel: 'Guías',
        accessedAt: formatear(guias[0].creado_en),
      });
    }
    if (atlas[0]) {
      items.push({
        id: `a-${atlas[0].id}`,
        originalId: atlas[0].id,
        module: 'atlas',
        title: atlas[0].titulo,
        moduleLabel: 'Atlas',
        accessedAt: formatear(atlas[0].creado_en),
      });
    }
    if (calculadoras[0]) {
      items.push({
        id: `k-${calculadoras[0].id}`,
        originalId: calculadoras[0].id,
        module: 'calculadora',
        title: calculadoras[0].nombre,
        moduleLabel: 'Calculadoras',
        accessedAt: formatear(calculadoras[0].creado_en),
      });
    }
    return items;
  }, [contenidos, guias, atlas, calculadoras]);

  // tap en un reciente: abre directamente el modal de detalle correspondiente
  const handleRecentPress = useCallback(
    (item: RecentItem) => {
      switch (item.module) {
        case 'contenido':
          navigation.navigate('ContenidoDetail', { id: item.originalId });
          return;
        case 'calculadora':
          navigation.navigate('CalculadoraDetail', { id: item.originalId });
          return;
        case 'atlas':
          navigation.navigate('AtlasDetail', { id: item.originalId });
          return;
        case 'guia':
          navigation.navigate('GuiaDetail', { id: item.originalId });
          return;
      }
    },
    [navigation],
  );

  // arma el grid con los counts dinamicos
  const modules: HomeModule[] = useMemo(
    () => [
      {
        id: 'hipertension',
        title: 'Hipertensión',
        description: 'Contenido teórico y clínico',
        itemCount: contenidos.length,
        route: 'Contenidos',
      },
      {
        id: 'calculadoras',
        title: 'Calculadoras',
        description: 'Herramientas clínicas',
        itemCount: calculadoras.length,
        route: 'Calculadoras',
      },
      {
        id: 'atlas',
        title: 'Atlas',
        description: 'Galería visual con filtros',
        itemCount: atlas.length,
        route: 'Atlas',
      },
      {
        id: 'guias',
        title: 'Guías',
        description: 'Algoritmos y protocolos',
        itemCount: guias.length,
        route: 'Guias',
      },
      {
        id: 'bibliografia',
        title: 'Bibliografía',
        description: 'Referencias y fuentes',
        itemCount: bibliografia.length,
        route: 'Bibliografia',
      },
    ],
    [
      contenidos.length,
      calculadoras.length,
      atlas.length,
      guias.length,
      bibliografia.length,
    ],
  );

  // animaciones del header y las cards
  // todas son refs estables (no se recrean en cada render) para evitar
  // que useFocusEffect se reinicie cada vez que llega un fetch del backend
  const headerAnim = useRef(new Animated.Value(0)).current;
  const sectionTitleAnim = useRef(new Animated.Value(0)).current;
  // 5 modulos fijos (contenidos, calc, atlas, guias, biblio)
  const moduleAnims = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(0)),
  ).current;
  // maximo 4 recientes (uno por modulo de contenido)
  const recentAnims = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0)),
  ).current;

  // se dispara cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      headerAnim.setValue(0);
      sectionTitleAnim.setValue(0);
      moduleAnims.forEach((a) => a.setValue(0));
      recentAnims.forEach((a) => a.setValue(0));

      Animated.sequence([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(sectionTitleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.stagger(
            70,
            moduleAnims.map((a) =>
              Animated.timing(a, {
                toValue: 1,
                duration: 380,
                useNativeDriver: true,
              }),
            ),
          ),
        ]),
        Animated.stagger(
          60,
          recentAnims.map((a) =>
            Animated.timing(a, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
          ),
        ),
      ]).start();
    }, [headerAnim, sectionTitleAnim, moduleAnims, recentAnims]),
  );

  const handleModulePress = (module: HomeModule) => {
    haptics.tap();
    navigation.navigate(module.route);
  };

  const openBusqueda = () => {
    haptics.tap();
    navigation.navigate('Busqueda');
  };

  const openFavoritos = () => {
    haptics.tap();
    navigation.navigate('Favoritos');
  };

  // tomamos el primer nombre del usuario logueado, si no hay usamos algo neutro
  const firstName = (user?.nombre_completo || '').split(' ')[0] || 'estudiante';
  const greeting = `${saludoPorHora()}, ${firstName}`;

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* banner azul con animacion */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={[s.headerBanner, { paddingTop: insets.top + 16 }]}>
          {/* boton de settings en la esquina */}
          <TouchableOpacity
            style={[s.settingsButton, { top: insets.top + 12 }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={s.headerAccent} />
          <Text style={s.greeting}>{greeting}</Text>
          <Text style={s.subtitle}>Bienvenido a FamilyMed App · UDES</Text>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* accesos rapidos: busqueda global y favoritos */}
        <Animated.View
          style={[s.quickActions, { opacity: sectionTitleAnim }]}
        >
          <TouchableOpacity
            style={s.quickAction}
            activeOpacity={0.85}
            onPress={openBusqueda}
          >
            <View style={s.quickActionIcon}>
              <Ionicons name="search" size={18} color={colors.primary} />
            </View>
            <Text style={s.quickActionText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.quickAction}
            activeOpacity={0.85}
            onPress={openFavoritos}
          >
            <View style={s.quickActionIcon}>
              <Ionicons name="heart" size={18} color={colors.primary} />
            </View>
            <Text style={s.quickActionText}>Favoritos</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* grid 2x2 */}
        <Animated.Text style={[s.sectionTitle, { opacity: sectionTitleAnim }]}>
          Módulos
        </Animated.Text>
        <View style={s.modulesGrid}>
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              animValue={moduleAnims[index] ?? new Animated.Value(1)}
              onPress={handleModulePress}
            />
          ))}
        </View>

        {/* recientes */}
        <Animated.Text style={[s.sectionTitle, { opacity: sectionTitleAnim }]}>
          Recientes
        </Animated.Text>
        <FlatList
          data={recentItems}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.recentList}
          renderItem={({ item, index }) => (
            <RecentCard
              item={item}
              animValue={recentAnims[index] ?? new Animated.Value(1)}
              onPress={handleRecentPress}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
