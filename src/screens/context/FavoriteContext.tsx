import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ArtTool = {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
};

type FavoriteContextType = {
  favoriteItems: ArtTool[];
  addFavorite: (item: ArtTool) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

type FavoriteProviderProps = {
  children: ReactNode;
};

export const FavoriteProvider: React.FC<FavoriteProviderProps> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<ArtTool[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavoriteItems(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites: ', error);
      }
    };

    loadFavorites();
  }, []);

  const addFavorite = async (item: ArtTool) => {
    const newFavorites = [...favoriteItems, item];
    setFavoriteItems(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFavorite = async (id: string) => {
    const newFavorites = favoriteItems.filter(item => item.id !== id);
    setFavoriteItems(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (id: string) => {
    return favoriteItems.some(item => item.id === id);
  };

  const value = useMemo(() => ({
    favoriteItems,
    addFavorite,
    removeFavorite,
    isFavorite,
  }), [favoriteItems]);

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};