import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'GLUECKSRAD_PROFILES';

export const loadProfiles = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { Standard: [] };
  } catch (e) {
    return { Standard: [] };
  }
};

export const saveProfiles = async (profiles: any) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profiles)
    );
  } catch (e) {}
};
