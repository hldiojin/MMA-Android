import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

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

  const handleHeartPress = (id: string) => {
    setFavoriteIds((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const uniqueBrands = Array.from(new Set(artTools.map(tool => tool.brand)));

  const filteredArtTools = selectedBrand
    ? artTools.filter(tool => tool.brand === selectedBrand)
    : artTools;

  const renderItem = ({ item }: { item: ArtTool }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.artName}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.deal}>Deal: {item.limitedTimeDeal * 100}% off</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item.id })}>
          <Text style={styles.detailButton}>View Details</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleHeartPress(item.id)}>
        <Icon
          name="heart"
          size={24}
          color={favoriteIds.has(item.id) ? "#ff6347" : "#ccc"}
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </View>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center', // Center items vertically
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    color: '#ff6347',
    fontWeight: '600',
    marginBottom: 6,
  },
  deal: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: '500',
  },
  detailButton: {
    fontSize: 14,
    color: '#1E90FF',
    marginTop: 8,
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
    alignItems: 'center', // Center text horizontally
  },
  selectedBrandButton: {
    backgroundColor: '#ff6347',
    borderColor: '#ff6347',
  },
  brandButtonText: {
    color: '#333',
  },
});

export default HomeScreen;