import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { ThemeContext } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';

export default function AboutScreen() {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const t = translations[language] || translations.DE;

  const dark = theme === 'dark';

  const openPaypalCoffee = () => {
    Linking.openURL('https://paypal.me/riwebandsoftware/3');
  };

  const openPaypalFree = () => {
    Linking.openURL('https://paypal.me/riwebandsoftware');
  };

  const openWebsite = () => {
    Linking.openURL('https://www.rene-ingenpass.de');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? '#0A0A0F' : '#f2f2f2' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: dark ? '#fff' : '#000' },
        ]}
      >
        Über diese App
      </Text>

      <Text
        style={[
          styles.text,
          { color: dark ? '#aaa' : '#555' },
        ]}
      >
        Dieses Glücksrad wurde mit React Native und Expo entwickelt.
        {'\n'}
        Sie ist und bleibt werbefrei.
      </Text>

      <Text
        style={[
          styles.text,
          { color: dark ? '#aaa' : '#555' },
        ]}
      >
        ☕ Wenn du möchtest, kannst du mir einen Kaffee spendieren:
      </Text>

      {/* 3€ Button */}
      <Pressable
        style={[
          styles.button,
          { backgroundColor: '#4facfe' },
        ]}
        onPress={openPaypalCoffee}
      >
        <Ionicons name="cafe-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>
          Kaffee (3 €)
        </Text>
      </Pressable>

      {/* Freier Betrag */}
      <Pressable
        style={[
          styles.button,
          { backgroundColor: '#10AC84' },
        ]}
        onPress={openPaypalFree}
      >
        <Ionicons name="heart-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>
          Freier Betrag
        </Text>
      </Pressable>

      <View style={{ marginTop: 40 }}>
        <Text
          style={[
            styles.version,
            { color: dark ? '#666' : '#888' },
          ]}
        >
          Version 1.0.0
        </Text>

        <Text
          style={[
            styles.version,
            { color: dark ? '#666' : '#888' },
          ]}
        >
          R.I. Web & Software Entwicklung
        </Text>

        <Pressable onPress={openWebsite}>
          <Text style={styles.link}>
            🌍 www.rene-ingenpass.de
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginVertical: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 5,
  },
  link: {
    textAlign: 'center',
    fontSize: 15,
    color: '#4facfe',
    marginTop: 10,
  },
});
