import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';

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

  const renderItem = ({ item }: { item: ArtTool }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.artName}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.deal}>Deal: {item.limitedTimeDeal * 100}% off</Text>
        <Pressable onPress={() => navigation.navigate('Detail', { item })}>
          <Text style={styles.detailButton}>View Details</Text>
        </Pressable>
      </View>
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
    <FlatList
      data={artTools}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',           // Arrange items in a row
    padding: 15,                    // Add padding inside the container
    marginVertical: 10,             // Space between items
    marginHorizontal: 20,           // Horizontal margin for card spacing
    backgroundColor: '#fff',        // White background for the card
    borderRadius: 12,               // Smooth rounded corners
    shadowColor: '#000',            // Shadow color for iOS
    shadowOffset: { width: 0, height: 4 }, // Shadow for iOS
    shadowOpacity: 0.1,             // Light shadow opacity
    shadowRadius: 8,                // Smooth shadow spread for iOS
    elevation: 6,                   // Elevation for Android shadow
  },
  image: {
    width: 90,                      // Larger image size for better visibility
    height: 90,
    borderRadius: 8,                // Rounded corners for the image
    marginRight: 15,                // Space between image and text
    backgroundColor: '#f0f0f0',     // Placeholder background for images
  },
  infoContainer: {
    flex: 1,                        // Takes the remaining space after the image
    justifyContent: 'center',       // Center content vertically
  },
  title: {
    fontSize: 18,                   // Font size for item name
    fontWeight: 'bold',             // Bold font for emphasis
    color: '#333',                  // Dark color for readability
    marginBottom: 6,                // Space below title
  },
  price: {
    fontSize: 16,                   // Font size for price
    color: '#ff6347',               // Attractive "tomato" color for price
    fontWeight: '600',              // Slightly bold to highlight price
    marginBottom: 6,                // Space between price and deal
  },
  deal: {
    fontSize: 14,                   // Smaller font size for the deal text
    color: '#228B22',               // Green color for the deal percentage
    fontWeight: '500',              // Medium font for emphasis
  },
  detailButton: {
    fontSize: 14,                   // Font size for "View Details" button
    color: '#1E90FF',               // Bright blue for clickable text
    marginTop: 8,                   // Margin at the top for spacing
  },
  loading: {
    flex: 1,                        // Takes full screen
    justifyContent: 'center',       // Center content vertically
    alignItems: 'center',           // Center content horizontally
    backgroundColor: '#f4f4f4',     // Light gray background for loading screen
  },
});



export default HomeScreen;
