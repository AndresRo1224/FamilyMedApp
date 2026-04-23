// pantalla de calculadoras (por ahora en construccion)

import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const CalculadorasScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Calculadoras</Text>
        <Text style={styles.subtitle}>Pantalla en construcción</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default CalculadorasScreen;
