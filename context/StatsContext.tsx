import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export type WinEntry = {
  id: string;
  profile: string;
  winner: string;
  timestamp: number;
};

type StatsContextType = {
  history: WinEntry[];
  addWin: (profile: string, winner: string) => void;
  clearHistory: () => void;
};

export const StatsContext = createContext<StatsContextType>({
  history: [],
  addWin: () => {},
  clearHistory: () => {},
});

const STORAGE_KEY = 'WHEEL_HISTORY';

export const StatsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<WinEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const saveHistory = async (data: WinEntry[]) => {
    setHistory(data);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  };

  const addWin = (profile: string, winner: string) => {
    const newEntry: WinEntry = {
      id: Date.now().toString(),
      profile,
      winner,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...history];
    saveHistory(updated);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return (
    <StatsContext.Provider
      value={{ history, addWin, clearHistory }}
    >
      {children}
    </StatsContext.Provider>
  );
};
