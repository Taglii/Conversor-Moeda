import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@conversor_moedas_favoritas';
const DEFAULT_FAVORITES = ['BRL', 'USD', 'EUR', 'GBP', 'ARS'];

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
  const [isReady, setIsReady] = useState(false);

  // Carrega favoritas do AsyncStorage ao inicializar
  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        console.error('Erro ao ler favoritas do AsyncStorage:', error);
      } finally {
        setIsReady(true);
      }
    }

    loadFavorites();
  }, []);

  // Salva no AsyncStorage sempre que favoritos mudarem
  const persistFavorites = async (newFavorites) => {
    try {
      setFavorites(newFavorites);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao salvar favoritas no AsyncStorage:', error);
    }
  };

  const isFavorite = (code) => {
    return favorites.includes(code);
  };

  const toggleFavorite = (code) => {
    if (!code) return;
    const upperCode = code.toUpperCase();
    if (favorites.includes(upperCode)) {
      persistFavorites(favorites.filter((item) => item !== upperCode));
    } else {
      persistFavorites([...favorites, upperCode]);
    }
  };

  const addFavorite = (code) => {
    if (!code) return;
    const upperCode = code.toUpperCase();
    if (!favorites.includes(upperCode)) {
      persistFavorites([...favorites, upperCode]);
    }
  };

  const removeFavorite = (code) => {
    if (!code) return;
    const upperCode = code.toUpperCase();
    persistFavorites(favorites.filter((item) => item !== upperCode));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        isReady,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}

