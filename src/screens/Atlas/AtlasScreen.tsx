// pantalla del atlas (por ahora en construccion)

import React, { useCallback, useRef } from 'react';
import { Animated, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import { atlasStyles as s } from './AtlasScreen.styles';

const AtlasScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      headerAnim.setValue(0);
      contentAnim.setValue(0);

      Animated.sequence([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [headerAnim, contentAnim]),
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
          <Text style={s.title}>Atlas</Text>
          <Text style={s.subtitle}>Galería visual clínica</Text>
        </View>
      </Animated.View>

      <Animated.View style={[s.content, { opacity: contentAnim }]}>
        <Text style={s.placeholderTitle}>En construcción</Text>
        
      </Animated.View>
    </View>
  );
};

export default AtlasScreen;
