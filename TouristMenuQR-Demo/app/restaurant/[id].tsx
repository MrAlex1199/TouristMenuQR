import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  ActivityIndicator,
  Appbar,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiService } from '../../src/services/api';
import { Restaurant, MenuItem, MenuCategory } from '../../src/types';
import MenuDisplay from '../../src/components/MenuDisplay';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (id) {
      loadRestaurant();
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRestaurant(id!);
      setRestaurant(data);
    } catch (error) {
      console.error('Error loading restaurant:', error);
      Alert.alert('Error', 'Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (restaurant?.phoneNumber) {
      Linking.openURL(`tel:${restaurant.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (restaurant?.website) {
      Linking.openURL(restaurant.website);
    }
  };

  const handleEmail = () => {
    if (restaurant?.email) {
      Linking.openURL(`mailto:${restaurant.email}`);
    }
  };

  const handleMenuItemPress = (item: MenuItem, category: MenuCategory) => {
    Alert.alert(
      item.name,
      `${item.description}\n\nPrice: ฿${item.price.toFixed(2)}${
        item.preparationTime ? `\nPreparation time: ${item.preparationTime} minutes` : ''
      }${
        item.allergens?.length ? `\nAllergens: ${item.allergens.join(', ')}` : ''
      }`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Add to Favorites', onPress: () => {
          // TODO: Implement favorites functionality
          Alert.alert('Coming Soon', 'Favorites feature will be available soon!');
        }},
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <Button mode="outlined" onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  if (showMenu) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => setShowMenu(false)} />
          <Appbar.Content title={`${restaurant.name} - Menu`} />
        </Appbar.Header>
        <MenuDisplay 
          restaurantId={restaurant._id} 
          onItemPress={handleMenuItemPress}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={restaurant.name} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Restaurant Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.header}>
              {restaurant.logo && (
                <Image source={{ uri: restaurant.logo }} style={styles.logo} />
              )}
              <View style={styles.headerInfo}>
                <Title style={styles.restaurantName}>{restaurant.name}</Title>
                <Paragraph style={styles.description}>
                  {restaurant.description}
                </Paragraph>
                
                {restaurant.averageRating && (
                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>
                      ⭐ {restaurant.averageRating.toFixed(1)}
                    </Text>
                    {restaurant.totalReviews && (
                      <Text style={styles.reviewCount}>
                        ({restaurant.totalReviews} reviews)
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Restaurant Images */}
        {restaurant.images && restaurant.images.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Photos</Title>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {restaurant.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.image} />
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        )}

        {/* Contact Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Contact Information</Title>
            
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Address:</Text>
              <Text style={styles.contactValue}>{restaurant.address}</Text>
            </View>

            {restaurant.phoneNumber && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text 
                  style={[styles.contactValue, styles.link]} 
                  onPress={handleCall}
                >
                  {restaurant.phoneNumber}
                </Text>
              </View>
            )}

            {restaurant.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text 
                  style={[styles.contactValue, styles.link]} 
                  onPress={handleEmail}
                >
                  {restaurant.email}
                </Text>
              </View>
            )}

            {restaurant.website && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Website:</Text>
                <Text 
                  style={[styles.contactValue, styles.link]} 
                  onPress={handleWebsite}
                >
                  {restaurant.website}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Cuisine Types */}
        {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Cuisine Types</Title>
              <View style={styles.cuisineTypes}>
                {restaurant.cuisineTypes.map((cuisine, index) => (
                  <Chip key={index} style={styles.cuisineChip}>
                    {cuisine}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Opening Hours */}
        {restaurant.openingHours && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Opening Hours</Title>
              {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                <View key={day} style={styles.hoursItem}>
                  <Text style={styles.dayLabel}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}:
                  </Text>
                  <Text style={styles.hoursValue}>
                    {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* QR Code */}
        {restaurant.qrCode && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>QR Code</Title>
              <Paragraph>Share this QR code with customers:</Paragraph>
              <View style={styles.qrContainer}>
                <Image source={{ uri: restaurant.qrCode }} style={styles.qrCode} />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <Surface style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={() => setShowMenu(true)}
            style={styles.actionButton}
            icon="food"
          >
            View Menu
          </Button>
          
          {restaurant.phoneNumber && (
            <Button 
              mode="outlined" 
              onPress={handleCall}
              style={styles.actionButton}
              icon="phone"
            >
              Call Restaurant
            </Button>
          )}
        </Surface>
      </ScrollView>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  contactLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  contactValue: {
    flex: 1,
  },
  link: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  cuisineTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuisineChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  hoursItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  hoursValue: {
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  actions: {
    margin: 16,
    padding: 16,
    elevation: 2,
  },
  actionButton: {
    marginBottom: 10,
  },
});