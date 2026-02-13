import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Wheel from '../../components/Wheel';
import { LanguageContext } from '../../context/LanguageContext';
import { ProfileContext } from '../../context/ProfileContext';
import { StatsContext } from '../../context/StatsContext';
import { ThemeContext } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';

export default function HomeScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { profile, profiles } = useContext(ProfileContext);
  const { language } = useContext(LanguageContext);
  const { addWin } = useContext(StatsContext);

  const [winner, setWinner] = useState<string | null>(null);
  const [spinTrigger, setSpinTrigger] = useState(0);

  const dark = theme === 'dark';
  const items = profiles[profile] || [];

  // 🔐 Sicherer Übersetzungszugriff
  const langKey =
    language && translations[language.toUpperCase()]
      ? language.toUpperCase()
      : 'EN';

  const t = translations[langKey];

  // 🔄 Spin Reset bei Profilwechsel
  useEffect(() => {
    setSpinTrigger(0);
  }, [profile]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? '#0f0f14' : '#f2f2f2' },
      ]}
    >
      {/* TITLE */}
      <Text style={[styles.title, { color: dark ? '#fff' : '#000' }]}>
        {t.wheel} Pro
      </Text>

      {/* PROFIL BADGE */}
      <View
        style={[
          styles.profileBadge,
          { backgroundColor: dark ? '#2a2a33' : '#ddd' },
        ]}
      >
        <Text
          style={[
            styles.profileText,
            { color: dark ? '#aaa' : '#555' },
          ]}
        >
          {t.profiles}: {profile}
        </Text>
      </View>

      {/* THEME SWITCH */}
      <Pressable
        style={styles.themeToggle}
        onPress={toggleTheme}
      >
        <Ionicons
          name={dark ? 'sunny-outline' : 'moon-outline'}
          size={24}
          color={dark ? '#fff' : '#000'}
        />
      </Pressable>

      {/* 🎡 WHEEL */}
      <Wheel
        items={items}
        spinTrigger={spinTrigger}
        onFinish={(name) => {
          setWinner(name);
          addWin(profile, name); // 🔥 Gewinner speichern
        }}
      />

      {/* START BUTTON */}
      <Pressable
        style={[
          styles.startButton,
          { backgroundColor: dark ? '#252424' : '#fff' },
          items.length === 0 && { opacity: 0.5 },
        ]}
        disabled={items.length === 0}
        onPress={() => setSpinTrigger((prev) => prev + 1)}
      >
        <Text
          style={[
            styles.startText,
            { color: dark ? '#fff' : '#000' },
          ]}
        >
          {t.spin.toUpperCase()}
        </Text>
      </Pressable>

      {/* WINNER OVERLAY */}
      <Modal visible={!!winner} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.winnerCard}>
            <Text style={styles.congratsText}>
              🎉 {t.winner || 'GEWONNEN'}
            </Text>

            <View style={styles.winnerNameBorder}>
              <Text style={styles.winText}>
                {winner}
              </Text>
            </View>

            <Pressable
              style={styles.closeBtn}
              onPress={() => setWinner(null)}
            >
              <Text style={styles.closeBtnText}>
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  profileBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
  },
  profileText: {
    fontWeight: '700',
    fontSize: 14,
  },
  themeToggle: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 10,
  },
  startButton: {
    marginTop: 50,
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerCard: {
    width: '85%',
    backgroundColor: '#1c1c24',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#00e0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  congratsText: {
    color: '#00e0ff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 15,
  },
  winnerNameBorder: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  winText: {
    fontSize: 42,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: '#00e0ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
