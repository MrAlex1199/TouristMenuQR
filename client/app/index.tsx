import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, FAB, Chip, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { apiService } from '../src/services/api';
import { locationService, LocationResult } from '../src/services/locationService';
import { favoritesService } from '../src/services/favoritesService';

export default function HomeScreen() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState({ restaurants: 0, menuItems: 0 });

  useEffect(() => {
    loadNearbyRestaurants();
    loadFavoritesCount();
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

  const loadFavoritesCount = async () => {
    try {
      const count = await favoritesService.getFavoritesCount();
      setFavoritesCount(count);
    } catch (error) {
      console.error('Error loading favorites count:', error);
    }
  };

  const handleGetLocation = async () => {
    try {
      setLocationLoading(true);
      const currentLocation = await locationService.getCurrentLocation({
        showAlert: true,
      });
      
      if (currentLocation) {
        setLocation(currentLocation);
        
        // Get nearby restaurants based on location
        try {
          const nearbyRestaurants = await apiService.getNearbyRestaurants(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            5000 // 5km radius
          );
          setRestaurants(nearbyRestaurants);
          
          Alert.alert(
            'Location Found',
            `Found ${nearbyRestaurants.length} restaurants within 5km of your location.`
          );
        } catch (error) {
          console.error('Error loading nearby restaurants:', error);
          Alert.alert('Info', 'Using demo restaurants as nearby restaurants API is not available.');
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleScanQR = () => {
    router.push('/scanner');
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const handleFavoritesPress = () => {
    router.push('/favorites');
  };

  const calculateDistance = (restaurant: any) => {
    if (!location || !restaurant.location?.coordinates) return null;
    
    const distance = locationService.calculateDistance(
      location.coords,
      {
        latitude: restaurant.location.coordinates[1],
        longitude: restaurant.location.coordinates[0],
      }
    );
    
    return locationService.formatDistance(distance);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Title style={styles.title}>TouristMenuQR</Title>
            <Paragraph style={styles.subtitle}>
              Discover restaurants and menus with QR codes
            </Paragraph>
          </View>
          
          <View style={styles.headerActions}>
            <IconButton
              icon="heart"
              iconColor="#fff"
              size={24}
              onPress={handleFavoritesPress}
              style={styles.headerButton}
            />
            {(favoritesCount.restaurants > 0 || favoritesCount.menuItems > 0) && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {favoritesCount.restaurants + favoritesCount.menuItems}
                </Text>
              </View>
            )}
          </View>
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

        <Card style={styles.locationCard}>
          <Card.Content>
            <View style={styles.locationHeader}>
              <Title>Find Nearby Restaurants</Title>
              {location && (
                <Chip icon="map-marker" compact>
                  Location Found
                </Chip>
              )}
            </View>
            <Paragraph>
              Get your current location to find restaurants near you
            </Paragraph>
            <Button 
              mode="outlined" 
              onPress={handleGetLocation}
              style={styles.locationButton}
              icon="crosshairs-gps"
              loading={locationLoading}
              disabled={locationLoading}
            >
              {location ? 'Update Location' : 'Get My Location'}
            </Button>
            
            {location && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  📍 Lat: {location.coords.latitude.toFixed(6)}, 
                  Lng: {location.coords.longitude.toFixed(6)}
                </Text>
                {location.accuracy && (
                  <Text style={styles.accuracyText}>
                    Accuracy: ±{Math.round(location.accuracy)}m
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>
              {location ? 'Nearby Restaurants' : 'Featured Restaurants'}
            </Title>
            {location && (
              <Chip icon="map-marker-radius" compact>
                Within 5km
              </Chip>
            )}
          </View>
          
          {restaurants.map((restaurant: any) => {
            const distance = calculateDistance(restaurant);
            
            return (
              <Card 
                key={restaurant._id} 
                style={styles.restaurantCard}
                onPress={() => handleRestaurantPress(restaurant._id)}
              >
                <Card.Content>
                  <View style={styles.restaurantHeader}>
                    <View style={styles.restaurantInfo}>
                      <Title>{restaurant.name}</Title>
                      <Paragraph numberOfLines={2}>{restaurant.description}</Paragraph>
                      <Text style={styles.address}>{restaurant.address}</Text>
                    </View>
                    
                    {distance && (
                      <Chip icon="map-marker-distance" compact style={styles.distanceChip}>
                        {distance}
                      </Chip>
                    )}
                  </View>
                  
                  <View style={styles.restaurantMeta}>
                    {restaurant.averageRating && (
                      <Chip icon="star" compact style={styles.ratingChip}>
                        {restaurant.averageRating.toFixed(1)}
                      </Chip>
                    )}
                    
                    {restaurant.cuisineTypes && (
                      <View style={styles.cuisineTypes}>
                        {restaurant.cuisineTypes.slice(0, 2).map((cuisine: string, index: number) => (
                          <Chip key={index} compact style={styles.cuisineChip}>
                            {cuisine}
                          </Chip>
                        ))}
                        {restaurant.cuisineTypes.length > 2 && (
                          <Text style={styles.moreText}>
                            +{restaurant.cuisineTypes.length - 2} more
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </View>

        {restaurants.length === 0 && !loading && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title>No restaurants found</Title>
              <Paragraph>
                Try scanning a QR code or enable location to find nearby restaurants
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
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
  headerActions: {
    position: 'relative',
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scanCard: {
    margin: 16,
    elevation: 4,
  },
  scanButton: {
    marginTop: 16,
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationButton: {
    marginTop: 16,
  },
  locationInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  accuracyText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  restaurantCard: {
    marginBottom: 12,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantInfo: {
    flex: 1,
    marginRight: 12,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  distanceChip: {
    backgroundColor: '#E3F2FD',
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingChip: {
    backgroundColor: '#FFF3E0',
    marginRight: 8,
  },
  cuisineTypes: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cuisineChip: {
    marginRight: 6,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 12,
    color: '#999',
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