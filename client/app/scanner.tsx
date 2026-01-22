import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import QRScanner from '../src/components/QRScanner';

export default function ScannerScreen() {
  const router = useRouter();

  const handleScan = (data: string) => {
    console.log('QR Code scanned:', data);
    
    // Parse QR code data
    if (data.startsWith('restaurant:')) {
      // Extract restaurant ID from QR code
      const parts = data.split(':');
      if (parts.length >= 2) {
        const restaurantId = parts[1];
        // Navigate to restaurant detail page
        router.push(`/restaurant/${restaurantId}`);
      }
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <QRScanner onScan={handleScan} onClose={handleClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});