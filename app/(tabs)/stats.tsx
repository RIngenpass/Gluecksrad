import React, { useContext } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ProfileContext } from '../../context/ProfileContext';
import { StatsContext } from '../../context/StatsContext';
import { ThemeContext } from '../../context/ThemeContext';

export default function StatsScreen() {
  const { history, clearHistory } =
    useContext(StatsContext);
  const { profile } = useContext(ProfileContext);
  const { theme } = useContext(ThemeContext);

  const dark = theme === 'dark';

  const filtered = history.filter(
    (h) => h.profile === profile
  );

  const winCount: { [key: string]: number } = {};

  filtered.forEach((entry) => {
    winCount[entry.winner] =
      (winCount[entry.winner] || 0) + 1;
  });

  const total = filtered.length;

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: dark
            ? '#0A0A0F'
            : '#f2f2f2',
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: dark ? '#fff' : '#000' },
        ]}
      >
        Statistik ({profile})
      </Text>

      {/* 📊 Auswertung */}
      {Object.keys(winCount).length === 0 ? (
        <Text
          style={{
            color: dark ? '#888' : '#666',
            marginTop: 20,
          }}
        >
          Noch keine Gewinne vorhanden.
        </Text>
      ) : (
        Object.keys(winCount).map((name) => {
          const count = winCount[name];
          const percent = total
            ? ((count / total) * 100).toFixed(1)
            : 0;

          return (
            <View
              key={name}
              style={[
                styles.card,
                {
                  backgroundColor: dark
                    ? '#161621'
                    : '#fff',
                  borderColor: dark
                    ? '#252533'
                    : '#ddd',
                },
              ]}
            >
              <Text
                style={[
                  styles.name,
                  { color: dark ? '#fff' : '#000' },
                ]}
              >
                {name}
              </Text>
              <Text
                style={{
                  color: dark ? '#aaa' : '#555',
                }}
              >
                {count} Siege ({percent}%)
              </Text>
            </View>
          );
        })
      )}

      {/* 🕒 Verlauf */}
      <Text
        style={[
          styles.subTitle,
          { color: dark ? '#fff' : '#000' },
        ]}
      >
        Verlauf
      </Text>

      {filtered.map((entry) => (
        <View
          key={entry.id}
          style={[
            styles.historyItem,
            {
              backgroundColor: dark
                ? '#1c1c24'
                : '#fff',
              borderColor: dark
                ? '#252533'
                : '#ddd',
            },
          ]}
        >
          <Text
            style={{
              color: dark ? '#fff' : '#000',
            }}
          >
            {entry.winner}
          </Text>
          <Text
            style={{
              color: dark ? '#888' : '#666',
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {new Date(
              entry.timestamp
            ).toLocaleString()}
          </Text>
        </View>
      ))}

      {/* 🗑 Verlauf löschen */}
      {filtered.length > 0 && (
        <Pressable
          style={styles.clearBtn}
          onPress={clearHistory}
        >
          <Text style={styles.clearText}>
            Verlauf löschen
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItem: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
  },
  clearBtn: {
    marginTop: 30,
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
