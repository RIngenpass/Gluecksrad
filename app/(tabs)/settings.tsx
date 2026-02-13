import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { Item, ProfileContext } from '../../context/ProfileContext';
import { ThemeContext } from '../../context/ThemeContext'; // Importiert
import { translations } from '../../utils/translations';

const COLORS = [
  '#4facfe', '#43e97b', '#fccb90', '#f5576c', '#b1f4cf',
  '#e84393', '#00cec9', '#ff8c00', '#6a0dad', '#39ff14', '#ffffff',
];

export default function SettingsScreen() {
  const { theme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const {
    profile,
    profiles,
    setProfile,
    updateItems,
    addProfile,
  } = useContext(ProfileContext);

  const isDark = theme === 'dark';
  const t = translations[language];
  const items: Item[] = profiles[profile] || [];

  const [newName, setNewName] = useState('');
  const [newProfileName, setNewProfileName] = useState('');

  // Dynamische Farben basierend auf dem Theme
  const themeStyles = {
    bg: isDark ? '#0A0A0F' : '#f2f2f2',
    card: isDark ? '#161621' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    subText: isDark ? '#888' : '#666',
    border: isDark ? '#252533' : '#dddddd',
    inputBg: isDark ? '#161621' : '#e8e8e8',
  };

  const languages = [
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'th', label: 'TH', flag: '🇹🇭' },
  ];

  const addParticipant = () => {
    if (!newName.trim()) return;
    const newItem: Item = {
      id: Date.now().toString(),
      label: newName,
      weight: 10,
      color: COLORS[0],
    };
    updateItems([...items, newItem]);
    setNewName('');
  };

  const updateWeight = (id: string, delta: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, weight: Math.max(1, item.weight + delta) } : item
    );
    updateItems(updated);
  };

  const updateColor = (id: string, color: string) => {
    const updated = items.map((item) => (item.id === id ? { ...item, color } : item));
    updateItems(updated);
  };

  const deleteItem = (id: string) => {
    updateItems(items.filter((i) => i.id !== id));
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeStyles.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          
          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: themeStyles.text }]}>{t.settings}</Text>
            <View style={[styles.langWrapper, { backgroundColor: themeStyles.inputBg, borderColor: themeStyles.border }]}>
              {languages.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  style={[
                    styles.langBtn,
                    language === lang.code && (isDark ? styles.langBtnActiveDark : styles.langBtnActiveLight),
                  ]}
                >
                  <Text style={styles.langEmoji}>{lang.flag}</Text>
                  <Text style={[
                    styles.langText,
                    { color: themeStyles.subText },
                    language === lang.code && styles.langTextActive
                  ]}>
                    {lang.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* PROFILE SECTION */}
          <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: themeStyles.text, marginBottom: 15 }]}>
  {t.profiles}
</Text>
            <View style={[styles.badge, { backgroundColor: isDark ? '#1c1c24' : '#ddd' }]}>
              <Text style={styles.badgeText}>{Object.keys(profiles).length}</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profileList}>
            {Object.keys(profiles).map((p) => (
              <Pressable
                key={p}
                onPress={() => setProfile(p)}
                style={[
                  styles.profileCard, 
                  { backgroundColor: themeStyles.card, borderColor: themeStyles.border },
                  profile === p && styles.profileActive
                ]}
              >
                <Text style={[
                  styles.profileText, 
                  { color: themeStyles.subText },
                  profile === p && styles.profileTextActive
                ]}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.inputWrapper, { backgroundColor: themeStyles.inputBg, borderColor: themeStyles.border }]}>
            <TextInput
              placeholder="Neues Profil..."
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={newProfileName}
              onChangeText={setNewProfileName}
              style={[styles.input, { color: themeStyles.text }]}
            />
            <Pressable
              style={[styles.miniAddBtn, !newProfileName.trim() && { opacity: 0.5 }]}
              onPress={() => {
                if (newProfileName.trim()) {
                  addProfile(newProfileName);
                  setNewProfileName('');
                }
              }}
            >
              <Ionicons name="add" size={22} color="#fff" />
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: themeStyles.border }]} />

          {/* PARTICIPANTS SECTION */}
          <Text style={[styles.sectionTitle, { color: themeStyles.text, marginBottom: 15 }]}>
  {t.participants}
</Text>

          <View style={[styles.inputWrapper, { backgroundColor: themeStyles.inputBg, borderColor: themeStyles.border }]}>
            <TextInput
              placeholder={t.enterName}
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={newName}
              onChangeText={setNewName}
              style={[styles.input, { color: themeStyles.text }]}
            />
            <Pressable style={styles.mainAddBtn} onPress={addParticipant}>
              <Ionicons name="person-add" size={20} color="#fff" />
            </Pressable>
          </View>

          {items.map((item) => (
            <View key={item.id} style={[styles.card, { backgroundColor: themeStyles.card, borderColor: themeStyles.border }]}>
              <View style={[styles.cardAccent, { backgroundColor: item.color }]} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.name, { color: themeStyles.text }]}>{item.label}</Text>
                  <Pressable onPress={() => deleteItem(item.id)} hitSlop={15}>
                    <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                  </Pressable>
                </View>

                <View style={styles.controlsRow}>
                  <View style={[styles.weightContainer, { backgroundColor: isDark ? '#1c1c2a' : '#f9f9f9' }]}>
                    <Text style={styles.weightLabel}>Gewichtung</Text>
                    <View style={styles.weightControls}>
                      <Pressable style={styles.stepBtn} onPress={() => updateWeight(item.id, -1)}>
                        <Ionicons name="remove" size={16} color="#fff" />
                      </Pressable>
                      <Text style={[styles.weightValue, { color: themeStyles.text }]}>{item.weight}</Text>
                      <Pressable style={styles.stepBtn} onPress={() => updateWeight(item.id, 1)}>
                        <Ionicons name="add" size={16} color="#fff" />
                      </Pressable>
                    </View>
                  </View>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
                    {COLORS.map((color) => (
                      <Pressable
                        key={color}
                        onPress={() => updateColor(item.id, color)}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          item.color === color && styles.selectedColor,
                        ]}
                      />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  langWrapper: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
  },
  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  langBtnActiveDark: {
    backgroundColor: '#2a2a3d',
    borderColor: '#4facfe',
    borderWidth: 1,
  },
  langBtnActiveLight: {
    backgroundColor: '#fff',
    borderColor: '#4facfe',
    borderWidth: 1,
    elevation: 2,
  },
  langEmoji: { fontSize: 14 },
  langText: { fontSize: 11, fontWeight: '700' },
  langTextActive: { color: '#4facfe' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  badgeText: { color: '#00e0ff', fontSize: 12, fontWeight: 'bold' },
  profileList: { marginBottom: 15 },
  profileCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
  },
  profileActive: {
    backgroundColor: '#00e0ff',
    borderColor: '#00e0ff',
  },
  profileText: { fontWeight: '600' },
  profileTextActive: { color: '#000', fontWeight: '700' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingRight: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  input: { flex: 1, padding: 16, fontSize: 16 },
  miniAddBtn: {
    backgroundColor: '#10AC84',
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainAddBtn: {
    backgroundColor: '#4facfe',
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, marginVertical: 10, marginBottom: 25 },
  card: {
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardAccent: { width: 5 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: { fontWeight: '700', fontSize: 18 },
  controlsRow: { flexDirection: 'column' },
  weightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 8,
    borderRadius: 12,
  },
  weightLabel: { color: '#888', fontSize: 12, fontWeight: '600' },
  weightControls: { flexDirection: 'row', alignItems: 'center' },
  weightValue: { fontSize: 16, fontWeight: '800', marginHorizontal: 15 },
  stepBtn: {
    backgroundColor: '#4facfe',
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPicker: { flexDirection: 'row' },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: { borderColor: '#4facfe' },
});