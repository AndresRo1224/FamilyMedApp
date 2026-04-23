// pantalla principal

import React from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import {
  AppModule,
  AppModules,
  MockCurrentUser,
  RecentItem,
  RecentItems,
} from '../../data/mockData';
import type { TabParamList } from '../../navigation/TabNavigator';

type HomeNavigationProp = BottomTabNavigationProp<TabParamList>;

// card de cada modulo en el grid
interface ModuleCardProps {
  module: AppModule;
  onPress: (module: AppModule) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.moduleCard}
      onPress={() => onPress(module)}
    >
      <View style={styles.moduleAccent} />
      <Text style={styles.moduleTitle}>{module.title}</Text>
      <Text style={styles.moduleDescription} numberOfLines={2}>
        {module.description}
      </Text>
      <Text style={styles.moduleCount}>
        {module.itemCount} {module.itemCount === 1 ? 'ítem' : 'ítems'}
      </Text>
    </TouchableOpacity>
  );
};

// card de items recientes
interface RecentCardProps {
  item: RecentItem;
}

const RecentCard: React.FC<RecentCardProps> = ({ item }) => {
  return (
    <View style={styles.recentCard}>
      <Text style={styles.recentModule}>{item.moduleLabel}</Text>
      <Text style={styles.recentTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.recentDate}>{item.accessedAt}</Text>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  const handleModulePress = (module: AppModule) => {
    const target = module.route as keyof TabParamList;
    navigation.navigate(target);
  };

  const firstName = MockCurrentUser.fullName.split(' ')[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {firstName}</Text>
          <Text style={styles.subtitle}>
            Bienvenido a FamilyMed App · UDES
          </Text>
        </View>

        {/* grid 2x2 */}
        <Text style={styles.sectionTitle}>Módulos</Text>
        <View style={styles.modulesGrid}>
          {AppModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onPress={handleModulePress}
            />
          ))}
        </View>

        {/* recientes */}
        <Text style={styles.sectionTitle}>Recientes</Text>
        <FlatList
          data={RecentItems}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentList}
          renderItem={({ item }) => <RecentCard item={item} />}
        />

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Universidad de Santander - UDES
          </Text>
          <Text style={styles.footerText}>
            Proyecto de grado {MockCurrentUser.programCode}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 14,
  },

  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moduleAccent: {
    width: 36,
    height: 4,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginBottom: 12,
  },
  moduleTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 4,
  },
  moduleDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 10,
    minHeight: 36,
  },
  moduleCount: {
    ...Typography.caption,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  recentList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  recentCard: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recentModule: {
    ...Typography.caption,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  recentTitle: {
    ...Typography.bodyLarge,
    color: Colors.text,
    marginBottom: 10,
    minHeight: 48,
  },
  recentDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
