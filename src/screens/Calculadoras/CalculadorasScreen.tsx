// pantalla de calculadoras (solo exhibicion)

import React, { useCallback, useRef } from 'react';
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
import { ClinicalCalculator, Calculators } from '../../data/mockData';
import { calculadorasStyles as s } from './CalculadorasScreen.styles';

// card de calculadora con animacion
interface CalculatorCardProps {
  calculator: ClinicalCalculator;
  animValue: Animated.Value;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  animValue,
}) => {
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
          <View style={s.shortNameBadge}>
            <Text style={s.shortNameText}>{calculator.shortName}</Text>
          </View>
          <Text style={s.outputBadge} numberOfLines={1}>
            {calculator.outputUnit}
          </Text>
        </View>

        <Text style={s.cardTitle}>{calculator.name}</Text>
        <Text style={s.cardDescription}>{calculator.description}</Text>

        {/* formula */}
        <View style={s.formulaBox}>
          <Text style={s.formulaLabel}>Fórmula</Text>
          <Text style={s.formulaText}>{calculator.formula}</Text>
        </View>

        {/* inputs */}
        <Text style={s.sectionLabel}>Parámetros</Text>
        <View style={s.inputsList}>
          {calculator.inputs.slice(0, 4).map((input, idx) => (
            <View key={idx} style={s.inputRow}>
              <View style={s.inputDot} />
              <Text style={s.inputText} numberOfLines={1}>
                {input}
              </Text>
            </View>
          ))}
          {calculator.inputs.length > 4 && (
            <Text style={s.inputText}>
              + {calculator.inputs.length - 4} más
            </Text>
          )}
        </View>

        {/* uso clinico */}
        <View style={s.clinicalUseBox}>
          <Text style={s.clinicalUseText}>{calculator.clinicalUse}</Text>
        </View>

        <Text style={s.reference} numberOfLines={1}>
          {calculator.reference}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CalculadorasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  // animaciones de entrada
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(
    Calculators.map(() => new Animated.Value(0)),
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

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

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
            {Calculators.length} herramientas clínicas
          </Text>
        </View>
      </Animated.View>

      <FlatList
        data={Calculators}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CalculatorCard
            calculator={item}
            animValue={cardAnims[index] ?? new Animated.Value(1)}
          />
        )}
      />
    </View>
  );
};

export default CalculadorasScreen;
