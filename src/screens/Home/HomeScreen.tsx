// pantalla principal

import React, { useCallback, useRef } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Colors } from '../../constants/colors';
import {
  AppModule,
  AppModules,
  MockCurrentUser,
  RecentItem,
  RecentItems,
} from '../../data/mockData';
import type { TabParamList } from '../../navigation/TabNavigator';
import { homeStyles as s } from './HomeScreen.styles';

type HomeNavigationProp = BottomTabNavigationProp<TabParamList>;

// card de modulo con animacion de stagger y scale al presionar
interface ModuleCardProps {
  module: AppModule;
  animValue: Animated.Value;
  onPress: (module: AppModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  animValue,
  onPress,
}) => {
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

// card de item reciente con animacion
interface RecentCardProps {
  item: RecentItem;
  animValue: Animated.Value;
}

const RecentCard: React.FC<RecentCardProps> = ({ item, animValue }) => {
  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <Animated.View
      style={{ opacity: animValue, transform: [{ translateX }] }}
    >
      <View style={s.recentCard}>
        <Text style={s.recentModule}>{item.moduleLabel}</Text>
        <Text style={s.recentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={s.recentDate}>{item.accessedAt}</Text>
      </View>
    </Animated.View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const insets = useSafeAreaInsets();

  // animaciones del header y las cards
  const headerAnim = useRef(new Animated.Value(0)).current;
  const sectionTitleAnim = useRef(new Animated.Value(0)).current;
  const moduleAnims = useRef(
    AppModules.map(() => new Animated.Value(0)),
  ).current;
  const recentAnims = useRef(
    RecentItems.map(() => new Animated.Value(0)),
  ).current;

  // se dispara cada vez que la pantalla recibe focus
  useFocusEffect(
    useCallback(() => {
      headerAnim.setValue(0);
      sectionTitleAnim.setValue(0);
      moduleAnims.forEach((a) => a.setValue(0));
      recentAnims.forEach((a) => a.setValue(0));

      // secuencia: header -> titulos -> cards stagger
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

  const handleModulePress = (module: AppModule) => {
    const target = module.route as keyof TabParamList;
    navigation.navigate(target);
  };

  const firstName = MockCurrentUser.fullName.split(' ')[0];

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* banner azul con animacion */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <View style={[s.headerBanner, { paddingTop: insets.top + 16 }]}>
          <View style={s.headerAccent} />
          <Text style={s.greeting}>Hola, {firstName}</Text>
          <Text style={s.subtitle}>Bienvenido a FamilyMed App · UDES</Text>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* grid 2x2 */}
        <Animated.Text style={[s.sectionTitle, { opacity: sectionTitleAnim }]}>
          Módulos
        </Animated.Text>
        <View style={s.modulesGrid}>
          {AppModules.map((module, index) => (
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
          data={RecentItems}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.recentList}
          renderItem={({ item, index }) => (
            <RecentCard
              item={item}
              animValue={recentAnims[index] ?? new Animated.Value(1)}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
