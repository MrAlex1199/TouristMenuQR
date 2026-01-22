import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { apiService } from '../src/services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNearbyRestaurants();
  }, []);

  const loadNearbyRestaurants = async () => {
    try {
      setLoading(true);
      // For demo purposes, load all restaurants
      // In a real app, you'd get user location first
      const data = await apiService.getRestaurants(1, 5);
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    router.push('/scanner');
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>TouristMenuQR</Title>
          <Paragraph style={styles.subtitle}>
            Discover restaurants and menus with QR codes
          </Paragraph>
        </View>

        <Card style={styles.scanCard}>
          <Card.Content>
            <Title>Scan QR Code</Title>
            <Paragraph>
              Point your camera at a restaurant's QR code to view their menu instantly
            </Paragraph>
            <Button 
              mode="contained" 
              onPress={handleScanQR}
              style={styles.scanButton}
              icon="qrcode-scan"
            >
              Scan QR Code
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Nearby Restaurants</Title>
          {restaurants.map((restaurant: any) => (
            <Card 
              key={restaurant._id} 
              style={styles.restaurantCard}
              onPress={() => handleRestaurantPress(restaurant._id)}
            >
              <Card.Content>
                <Title>{restaurant.name}</Title>
                <Paragraph numberOfLines={2}>{restaurant.description}</Paragraph>
                <Text style={styles.address}>{restaurant.address}</Text>
                {restaurant.cuisineTypes && (
                  <Text style={styles.cuisine}>
                    {restaurant.cuisineTypes.join(', ')}
                  </Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>

        {restaurants.length === 0 && !loading && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>No restaurants found</Title>
              <Paragraph>
                Try scanning a QR code or check back later for nearby restaurants
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB
        icon="qrcode-scan"
        style={styles.fab}
        onPress={handleScanQR}
        label="Scan QR"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  scanCard: {
    margin: 16,
    elevation: 4,
  },
  scanButton: {
    marginTop: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  restaurantCard: {
    marginBottom: 12,
    elevation: 2,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cuisine: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyCard: {
    margin: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});
