import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Surface, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface QRScannerProps {
  onScan?: (data: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);

    try {
      // Parse QR code data
      console.log('QR Code scanned:', data);
      
      // Check if it's a restaurant QR code
      if (data.startsWith('restaurant:')) {
        // Extract restaurant ID from QR code
        const parts = data.split(':');
        if (parts.length >= 2) {
          const restaurantId = parts[1];
          
          if (onScan) {
            onScan(data);
          } else {
            // Navigate to restaurant menu
            router.push(`/restaurant/${restaurantId}`);
          }
        } else {
          Alert.alert('Invalid QR Code', 'This QR code is not valid for our app.');
        }
      } else if (data.startsWith('http')) {
        // Handle web URLs
        Alert.alert(
          'Web Link Detected',
          'This QR code contains a web link. Do you want to open it?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open', onPress: () => {
              // You can use Linking.openURL(data) here
              console.log('Opening URL:', data);
            }},
          ]
        );
      } else {
        // Generic QR code
        Alert.alert('QR Code Scanned', `Content: ${data}`);
        if (onScan) {
          onScan(data);
        }
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process QR code');
    } finally {
      setLoading(false);
      
      // Reset scanner after 2 seconds
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Surface style={styles.permissionContainer}>
          <Text style={styles.text}>Camera permission is required to scan QR codes</Text>
          <Button mode="contained" onPress={requestPermission} style={styles.button}>
            Grant Permission
          </Button>
          {onClose && (
            <Button mode="outlined" onPress={onClose} style={styles.button}>
              Cancel
            </Button>
          )}
        </Surface>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Point your camera at a QR code
            </Text>
            {scanned && (
              <View style={styles.scannedContainer}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.scannedText}>✓ Scanned!</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.controls}>
            {onClose && (
              <Button 
                mode="contained" 
                onPress={onClose}
                buttonColor="rgba(0,0,0,0.7)"
                textColor="#fff"
              >
                Close
              </Button>
            )}
            <Button
              mode="outlined"
              onPress={() => setScanned(false)}
              buttonColor="rgba(255,255,255,0.1)"
              textColor="#fff"
              style={styles.button}
            >
              Scan Again
            </Button>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: 'relative',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    borderWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: -2,
    left: -2,
  },
  topRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    top: -2,
    right: -2,
    left: 'auto',
  },
  bottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    bottom: -2,
    left: -2,
    top: 'auto',
  },
  bottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
  },
  instructions: {
    position: 'absolute',
    bottom: 150,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  scannedContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  scannedText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    gap: 10,
  },
  permissionContainer: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});