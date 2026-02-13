import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageContext } from '../../context/LanguageContext';
import { translations } from '../../utils/translations';

export default function TabLayout() {
  const { language } = useContext(LanguageContext);
  const insets = useSafeAreaInsets();

  const safeLanguage =
    language && translations[language]
      ? language
      : 'DE';

  const t = translations[safeLanguage];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1c1c24',
          borderTopColor: '#1c1c24',
          height: 65 + insets.bottom, // 👈 dynamisch
          paddingBottom: insets.bottom, // 👈 WICHTIG
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#4facfe',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.wheel,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="radio-button-on" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: t.settings,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: t.about,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
  name="stats"
  options={{
    title: 'Statistik',
    tabBarIcon: ({ color, size }) => (
      <Ionicons
        name="bar-chart-outline"
        size={size}
        color={color}
      />
    ),
  }}
/>

    </Tabs>
  );
}
