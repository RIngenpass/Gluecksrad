import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export type Item = {
  id: string;
  label: string;
  weight: number;
  color: string;
};

type ProfilesType = {
  [key: string]: Item[];
};

type ProfileContextType = {
  profile: string;
  profiles: ProfilesType;
  setProfile: (name: string) => void;
  updateItems: (items: Item[]) => void;
  addProfile: (name: string) => void;
  resetToDefault: () => void;
};

// --- DEINE STANDARD TEILNEHMER ---
const DEFAULT_DATA: ProfilesType = {
  Standard: [
    { id: '1', label: 'Max', weight: 10, color: '#4facfe' },
    { id: '2', label: 'Anna', weight: 10, color: '#43e97b' },
    { id: '3', label: 'Lukas', weight: 10, color: '#f5576c' },
  ],
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: 'Standard',
  profiles: DEFAULT_DATA,
  setProfile: () => {},
  updateItems: () => {},
  addProfile: () => {},
  resetToDefault: () => {},
});

const STORAGE_KEY = 'GLUECKSRAD_PROFILES_V2';

export const ProfileProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<string>('Standard');
  const [profiles, setProfiles] = useState<ProfilesType>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false); // Verhindert frühzeitiges Überspeichern

  // 1. Beim App-Start laden
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          // Nur setzen, wenn das Objekt nicht komplett leer ist
          if (Object.keys(parsed).length > 0) {
            setProfiles(parsed);
          }
        } else {
          // Falls noch nie etwas gespeichert wurde (erster Start)
          // Bleibt es bei DEFAULT_DATA (bereits im State initialisiert)
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        }
      } catch (e) {
        console.error("Fehler beim Laden:", e);
      } finally {
        setIsLoaded(true); // Laden abgeschlossen
      }
    };

    loadData();
  }, []);

  // 2. Speichern nur, wenn der Ladevorgang durch ist
  useEffect(() => {
    if (isLoaded) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
        } catch (e) {
          console.error("Fehler beim Speichern:", e);
        }
      };
      saveData();
    }
  }, [profiles, isLoaded]);

  const updateItems = (items: Item[]) => {
    setProfiles(prev => ({
      ...prev,
      [profile]: items,
    }));
  };

  const addProfile = (name: string) => {
    if (!profiles[name]) {
      setProfiles(prev => ({
        ...prev,
        [name]: [],
      }));
      setProfile(name);
    }
  };

  const resetToDefault = () => {
    setProfiles(DEFAULT_DATA);
    setProfile('Standard');
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        profiles,
        setProfile,
        updateItems,
        addProfile,
        resetToDefault,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};