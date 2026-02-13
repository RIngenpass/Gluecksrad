import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'DE' | 'EN' | 'TH';

const STORAGE_KEY = 'APP_LANGUAGE';

export const translations = {
  DE: {
    settings: 'Einstellungen',
    participants: 'Teilnehmer in "Standard"',
    enterName: 'Name eingeben',
    chance: 'Chance',
    spin: 'Drehen',
  },
  EN: {
    settings: 'Settings',
    participants: 'Participants in "Standard"',
    enterName: 'Enter name',
    chance: 'Chance',
    spin: 'Spin',
  },
  TH: {
    settings: 'การตั้งค่า',
    participants: 'ผู้เข้าร่วมใน "มาตรฐาน"',
    enterName: 'กรอกชื่อ',
    chance: 'โอกาส',
    spin: 'หมุน',
  },
};

export const saveLanguage = async (lang: Language) => {
  await AsyncStorage.setItem(STORAGE_KEY, lang);
};

export const loadLanguage = async (): Promise<Language> => {
  const lang = await AsyncStorage.getItem(STORAGE_KEY);
  return (lang as Language) || 'DE';
};
