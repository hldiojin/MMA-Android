import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
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
  const { favoriteItems, removeFavorite, clearFavorites } = useFavorite();

  const handleDelete = (id: string) => {
    removeFavorite(id);
  };

  const handleClearFavorites = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorite items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => clearFavorites(),
        },
      ]
    );
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
      {/* Add Clear All Button */}
      {favoriteItems.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFavorites}>
          <Ionicons name="trash-bin-outline" size={20} color="white" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        data={favoriteItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer} // Added padding to avoid overlap
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
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
    paddingTop: 10, // Added padding to avoid overlap with Clear All button
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 25,
    margin: 10,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default FavouriteScreen;