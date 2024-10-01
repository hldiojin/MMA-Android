import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for icons
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

const FavouriteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { favoriteItems, removeFavorite } = useFavorite();

  const handleDelete = (id: string) => {
    removeFavorite(id);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity onPress={() => handleDelete(id)} style={styles.deleteButton}>
      <Ionicons name="trash-outline" size={24} color="white" />
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: ArtTool }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item.id })} style={styles.itemContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.artName}</Text>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.deal}>Deal: {item.limitedTimeDeal * 100}% off</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={favoriteItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    padding: 12,
    overflow: 'hidden', // To avoid overflows for rounded corners
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover', // Keep aspect ratio
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    marginTop: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: '600',
    marginBottom: 8,
  },
  deal: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: '500',
    backgroundColor: '#d4f3d4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%', // Adjusted width
    height: '100%',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    flexDirection: 'row',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default FavouriteScreen;