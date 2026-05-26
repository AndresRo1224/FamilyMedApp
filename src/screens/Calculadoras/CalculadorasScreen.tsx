// pantalla de calculadoras - lee desde el backend

import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
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

import { useTheme } from '../../contexts/ThemeContext';
import { useCalculadoras } from '../../hooks/useCalculadoras';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import type { Calculadora } from '../../services/types';
import { makeCalculadorasStyles } from './CalculadorasScreen.styles';

type CalcNav = NativeStackNavigationProp<RootStackParamList>;

// card de calculadora con animacion
interface CalculatorCardProps {
  calculadora: Calculadora;
  animValue: Animated.Value;
  onPress: (id: string) => void;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculadora,
  animValue,
  onPress,
}) => {
  const { colors } = useTheme();
  const s = useMemo(() => makeCalculadorasStyles(colors), [colors]);
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
        onPress={() => onPress(calculadora.id)}
        style={s.card}
      >
        <View style={s.cardHeader}>
          <View style={s.shortNameBadge}>
            <Text style={s.shortNameText}>{calculadora.nombre_corto}</Text>
          </View>
          <Text style={s.outputBadge} numberOfLines={1}>
            {calculadora.unidad_salida}
          </Text>
        </View>

        <Text style={s.cardTitle}>{calculadora.nombre}</Text>
        <Text style={s.cardDescription}>{calculadora.descripcion}</Text>

        {/* formula */}
        <View style={s.formulaBox}>
          <Text style={s.formulaLabel}>Fórmula</Text>
          <Text style={s.formulaText}>{calculadora.formula}</Text>
        </View>

        {/* parametros */}
        <Text style={s.sectionLabel}>Parámetros</Text>
        <View style={s.inputsList}>
          {calculadora.parametros.slice(0, 4).map((input, idx) => (
            <View key={idx} style={s.inputRow}>
              <View style={s.inputDot} />
              <Text style={s.inputText} numberOfLines={1}>
                {input}
              </Text>
            </View>
          ))}
          {calculadora.parametros.length > 4 && (
            <Text style={s.inputText}>
              + {calculadora.parametros.length - 4} más
            </Text>
          )}
        </View>

        {/* uso clinico */}
        <View style={s.clinicalUseBox}>
          <Text style={s.clinicalUseText}>{calculadora.uso_clinico}</Text>
        </View>

        <Text style={s.reference} numberOfLines={1}>
          {calculadora.referencia}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CalculadorasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CalcNav>();
  const { colors } = useTheme();
  const s = useMemo(() => makeCalculadorasStyles(colors), [colors]);

  const { data: calculadoras, loading, error, refetch } = useCalculadoras();

  const goToDetail = useCallback(
    (id: string) => navigation.navigate('CalculadoraDetail', { id }),
    [navigation],
  );

  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useMemo(
    () => calculadoras.map(() => new Animated.Value(0)),
    [calculadoras],
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
          <Text style={s.title}>Calculadoras</Text>
          <Text style={s.subtitle}>
            {calculadoras.length} herramientas clínicas
          </Text>
        </View>
      </Animated.View>

      {/* loading inicial */}
      {loading && calculadoras.length === 0 ? (
        <View style={[s.content, { padding: 40 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.placeholderText, { marginTop: 12 }]}>
            Cargando calculadoras…
          </Text>
        </View>
      ) : error ? (
        // estado de error con retry
        <View style={[s.content, { padding: 40 }]}>
          <Text
            style={[s.placeholderText, { marginBottom: 12, textAlign: 'center' }]}
          >
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
          data={calculadoras}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading && calculadoras.length > 0}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <CalculatorCard
              calculadora={item}
              animValue={cardAnims[index] ?? new Animated.Value(1)}
              onPress={goToDetail}
            />
          )}
        />
      )}
    </View>
  );
};

export default CalculadorasScreen;
