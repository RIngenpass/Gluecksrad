import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../context/LanguageContext';
import { ProfileProvider } from '../context/ProfileContext';
import { StatsProvider } from '../context/StatsContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
<ThemeProvider>
  <ProfileProvider>
    <StatsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </StatsProvider>
  </ProfileProvider>
</ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
