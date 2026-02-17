import React, { useContext } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LanguageContext } from '../../context/LanguageContext';
import { ProfileContext } from '../../context/ProfileContext';
import { StatsContext } from '../../context/StatsContext';
import { ThemeContext } from '../../context/ThemeContext';
import { translations } from '../../utils/translations';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { history, clearHistory } = useContext(StatsContext);
  const { profile } = useContext(ProfileContext);
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const t = translations[language] || translations.EN;
  const dark = theme === 'dark';

  const filtered = history.filter((h) => h.profile === profile);

  // Statistiken berechnen
  const winCount: { [key: string]: number } = {};
  filtered.forEach((entry) => {
    winCount[entry.winner] = (winCount[entry.winner] || 0) + 1;
  });

  const total = filtered.length;
  const sortedWinners = Object.keys(winCount).sort((a, b) => winCount[b] - winCount[a]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: dark ? '#0A0A0F' : '#F8F9FA' },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: dark ? '#FFFFFF' : '#1A1A1A' }]}>
        {t.statistik}
      </Text>
      <Text style={[styles.profileTag, { color: dark ? '#888' : '#666' }]}>
        {profile}
      </Text>

      {/* 📊 Auswertung Section */}
      <View style={styles.section}>
        {sortedWinners.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: dark ? '#555' : '#AAA' }]}>
              {t.noWins}
            </Text>
          </View>
        ) : (
          sortedWinners.map((name) => {
            const count = winCount[name];
            const percent = total ? ((count / total) * 100).toFixed(0) : 0;

            return (
              <View
                key={name}
                style={[
                  styles.card,
                  {
                    backgroundColor: dark ? '#161621' : '#FFFFFF',
                    borderColor: dark ? '#252533' : '#E0E0E0',
                  },
                ]}
              >
                <View style={styles.cardInfo}>
                  <Text style={[styles.name, { color: dark ? '#FFFFFF' : '#1A1A1A' }]}>
                    {name}
                  </Text>
                  <Text style={[styles.statsDetail, { color: dark ? '#AAA' : '#666' }]}>
                    {count} {t.wins}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: dark ? '#2A2A3C' : '#F0F0F0' }]}>
                  <Text style={[styles.badgeText, { color: dark ? '#FFF' : '#333' }]}>
                    {percent}%
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 🕒 Verlauf Section */}
      <View style={styles.section}>
        <Text style={[styles.subTitle, { color: dark ? '#FFFFFF' : '#1A1A1A' }]}>
          {t.history}
        </Text>

        {filtered.slice(0).reverse().map((entry) => ( // Neueste zuerst
          <View
            key={entry.id}
            style={[
              styles.historyItem,
              {
                backgroundColor: dark ? '#11111A' : '#FFFFFF',
                borderColor: dark ? '#222230' : '#EAEAEA',
              },
            ]}
          >
            <View style={styles.dot} />
            <View>
              <Text style={[styles.historyWinner, { color: dark ? '#EEE' : '#333' }]}>
                {entry.winner}
              </Text>
              <Text style={[styles.historyDate, { color: dark ? '#666' : '#999' }]}>
                {new Date(entry.timestamp).toLocaleString(
                  language === 'DE' ? 'de-DE' : language === 'TH' ? 'th-TH' : 'en-US'
                )}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 🗑 Verlauf löschen Button */}
      {filtered.length > 0 && (
        <Pressable 
          style={({ pressed }) => [
            styles.clearBtn,
            { opacity: pressed ? 0.7 : 1 }
          ]} 
          onPress={clearHistory}
        >
          <Text style={styles.clearText}>{t.clearHistory}</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 20,
  },
  profileTag: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statsDetail: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 15,
    marginBottom: 8,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 15,
  },
  historyWinner: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  clearBtn: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  clearText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});