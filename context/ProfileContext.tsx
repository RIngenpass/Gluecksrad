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
  deleteProfile: (name: string) => void; // Neu hinzugefügt
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
  deleteProfile: () => {}, // Initialwert
  resetToDefault: () => {},
});

const STORAGE_KEY = 'GLUECKSRAD_PROFILES_V2';

export const ProfileProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<string>('Standard');
  const [profiles, setProfiles] = useState<ProfilesType>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Beim App-Start laden
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (Object.keys(parsed).length > 0) {
            setProfiles(parsed);
            // Sicherstellen, dass das aktive Profil auch existiert
            const firstKey = Object.keys(parsed)[0];
            setProfile(firstKey);
          }
        } else {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        }
      } catch (e) {
        console.error("Fehler beim Laden:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // 2. Speichern bei Änderungen
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

  // --- NEU: PROFIL LÖSCHEN ---
  const deleteProfile = (name: string) => {
    setProfiles(prev => {
      const newProfiles = { ...prev };
      delete newProfiles[name];

      // Falls das gelöschte Profil gerade aktiv war:
      if (profile === name) {
        const remainingKeys = Object.keys(newProfiles);
        if (remainingKeys.length > 0) {
          setProfile(remainingKeys[0]); // Zum nächsten verfügbaren wechseln
        } else {
          // Fallback, falls alles gelöscht wurde (sollte durch UI verhindert werden)
          return DEFAULT_DATA;
        }
      }
      return newProfiles;
    });
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
        deleteProfile, // Hier exportiert
        resetToDefault,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};