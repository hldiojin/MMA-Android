import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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

type Props = {
  navigation: any;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [artTools, setArtTools] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { favoriteItems, addFavorite, removeFavorite, isFavorite } = useFavorite();

  const fetchArtTools = async () => {
    try {
      const response = await fetch('https://66e3e37dd2405277ed123139.mockapi.io/android');
      const data: ArtTool[] = await response.json();
      setArtTools(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchArtTools();
  }, []);

  const handleHeartPress = (item: ArtTool) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const uniqueBrands = Array.from(new Set(artTools.map(tool => tool.brand)));

  const filteredArtTools = selectedBrand
    ? artTools.filter(tool => tool.brand === selectedBrand)
    : artTools;

  const renderItem = ({ item }: { item: ArtTool }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item.id })} style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.artName}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.deal}>Deal: {item.limitedTimeDeal * 100}% off</Text>
      </View>
      <TouchableOpacity onPress={() => handleHeartPress(item)} style={styles.heartIconContainer}>
        <Icon
          name="heart"
          size={24}
          color={isFavorite(item.id) ? "#ff6347" : "#ccc"}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal style={styles.brandFilterContainer}>
        {uniqueBrands.map(brand => (
          <TouchableOpacity
            key={brand}
            style={[
              styles.brandButton,
              selectedBrand === brand && styles.selectedBrandButton
            ]}
            onPress={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
          >
            <Text style={styles.brandButtonText}>{brand}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredArtTools}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
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
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    padding: 10,
    position: 'relative', // To position the heart icon absolutely
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: '600',
    marginBottom: 6,
  },
  deal: {
    fontSize: 12,
    color: '#228B22',
    fontWeight: '500',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  heartIcon: {
    marginLeft: 10, // Space between info and heart icon
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  brandFilterContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
    marginBottom: 10, // Add margin to separate from items
  },
  listContainer: {
    paddingBottom: 10, // Add padding to the bottom of the list
  },
  brandButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 100, // Fixed width for buttons
    height: 40, // Fixed height for buttons
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
  },
  selectedBrandButton: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
  },
  brandButtonText: {
    color: '#333',
  },
  favoriteButton: {
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    alignItems: 'center',
    margin: 10,
  },
  favoriteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;