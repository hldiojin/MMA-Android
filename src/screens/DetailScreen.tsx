import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RouteProp } from '@react-navigation/native';
import { useFavorite } from './context/FavoriteContext'; // Đảm bảo đường dẫn đúng

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

type RootStackParamList = {
  Detail: { id: string };
};

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

const DetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [artTool, setArtTool] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { favoriteItems, addFavorite, removeFavorite, isFavorite } = useFavorite();

  const fetchArtToolDetail = async () => {
    try {
      const response = await fetch(`https://66e3e37dd2405277ed123139.mockapi.io/android/${id}`);
      const data: ArtTool = await response.json();
      setArtTool(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching art tool detail: ', error);
    }
  };

  useEffect(() => {
    fetchArtToolDetail();
  }, []);

  const handleFavoritePress = () => {
    if (artTool) {
      if (isFavorite(artTool.id)) {
        removeFavorite(artTool.id);
      } else {
        addFavorite(artTool);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Render art tool details here */}
      <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
        <Icon name="heart" size={24} color={isFavorite(id) ? "#ff6347" : "#ccc"} />
        <Text style={styles.favoriteButtonText}>{isFavorite(id) ? "Remove from Favorites" : "Add to Favorites"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  favoriteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6347',
  },
});

export default DetailScreen;