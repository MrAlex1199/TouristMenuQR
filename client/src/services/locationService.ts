import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  coords: LocationCoords;
  accuracy?: number;
  timestamp: number;
}

class LocationService {
  private currentLocation: LocationResult | null = null;
  private watchId: Location.LocationSubscription | null = null;

  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(options?: {
    accuracy?: Location.LocationAccuracy;
    timeout?: number;
    showAlert?: boolean;
  }): Promise<LocationResult | null> {
    try {
      // Check permission first
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        if (options?.showAlert) {
          Alert.alert(
            'Location Permission Required',
            'To find nearby restaurants, please enable location access in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Location.openSettingsAsync() }
            ]
          );
        }
        return null;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: options?.accuracy || Location.Accuracy.Balanced,
        timeout: options?.timeout || 15000,
      });

      const result: LocationResult = {
        coords: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        accuracy: location.coords.accuracy || undefined,
        timestamp: location.timestamp,
      };

      this.currentLocation = result;
      return result;
    } catch (error) {
      console.error('Error getting current location:', error);
      
      if (options?.showAlert) {
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please make sure location services are enabled and try again.',
          [{ text: 'OK' }]
        );
      }
      
      return null;
    }
  }

  async watchLocation(
    callback: (location: LocationResult) => void,
    options?: {
      accuracy?: Location.LocationAccuracy;
      distanceInterval?: number;
    }
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) return false;

      // Stop existing watch if any
      if (this.watchId) {
        this.watchId.remove();
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || Location.Accuracy.Balanced,
          distanceInterval: options?.distanceInterval || 100, // Update every 100 meters
        },
        (location) => {
          const result: LocationResult = {
            coords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            accuracy: location.coords.accuracy || undefined,
            timestamp: location.timestamp,
          };
          
          this.currentLocation = result;
          callback(result);
        }
      );

      return true;
    } catch (error) {
      console.error('Error watching location:', error);
      return false;
    }
  }

  stopWatchingLocation(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
  }

  getCachedLocation(): LocationResult | null {
    return this.currentLocation;
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(
    point1: LocationCoords,
    point2: LocationCoords
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
        Math.cos(this.toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  // Get address from coordinates (reverse geocoding)
  async getAddressFromCoords(coords: LocationCoords): Promise<string | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync(coords);
      if (addresses.length > 0) {
        const address = addresses[0];
        const parts = [
          address.street,
          address.district,
          address.city,
          address.region,
        ].filter(Boolean);
        
        return parts.join(', ');
      }
      return null;
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      return null;
    }
  }

  // Get coordinates from address (geocoding)
  async getCoordsFromAddress(address: string): Promise<LocationCoords | null> {
    try {
      const locations = await Location.geocodeAsync(address);
      if (locations.length > 0) {
        const location = locations[0];
        return {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      return null;
    }
  }

  // Check if location services are enabled
  async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  // Get location permission status
  async getPermissionStatus(): Promise<Location.PermissionStatus> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting permission status:', error);
      return Location.PermissionStatus.UNDETERMINED;
    }
  }
}

export const locationService = new LocationService();