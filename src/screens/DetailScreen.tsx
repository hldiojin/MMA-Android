import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

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
  route: any;
  navigation: any;
};

const DetailScreen: React.FC<Props> = ({ route }) => {
  const { id } = route.params;
  const [artTool, setArtTool] = useState<ArtTool | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchArtToolDetail = async () => {
    try {
      const response = await fetch(`https://66e3e37dd2405277ed123139.mockapi.io/android/${id}`);
      const data: ArtTool = await response.json();
      setArtTool(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching art tool details: ', error);
    }
  };

  useEffect(() => {
    fetchArtToolDetail();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!artTool) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load details. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: artTool.image }} style={styles.image} />
      <Text style={styles.title}>{artTool.artName}</Text>
      <Text style={styles.brand}>Brand: {artTool.brand}</Text>
      <Text style={styles.price}>${artTool.price}</Text>
      <Text style={styles.deal}>
        Deal: {artTool.limitedTimeDeal * 100}% off
      </Text>
      <Text style={styles.description}>{artTool.description}</Text>
      <Text style={styles.surface}>
        Glass Surface: {artTool.glassSurface ? 'Yes' : 'No'}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  brand: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#ff6347',
    fontWeight: '600',
    marginBottom: 10,
  },
  deal: {
    fontSize: 16,
    color: '#228B22',
    fontWeight: '500',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  surface: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6347',
  },
});

export default DetailScreen;
