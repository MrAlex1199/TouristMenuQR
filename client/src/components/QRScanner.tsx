import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, Platform } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { Button, Surface, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

interface QRScannerProps {
  onScan?: (data: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);

    try {
      console.log('QR Code scanned:', { type, data });
      
      // Parse QR code data
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
          `This QR code contains a web link:\n${data}\n\nDo you want to open it?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open', 
              onPress: async () => {
                try {
                  await Linking.openURL(data);
                } catch (error) {
                  Alert.alert('Error', 'Could not open the link');
                }
              }
            },
          ]
        );
      } else if (data.includes('menu') || data.includes('restaurant')) {
        // Generic restaurant/menu QR code
        Alert.alert(
          'Restaurant QR Code',
          `QR Code detected: ${data}\n\nThis appears to be a restaurant QR code. In a real app, this would navigate to the restaurant page.`,
          [
            { text: 'OK' },
            { text: 'Demo Restaurant', onPress: () => router.push('/restaurant/demo-restaurant-1') }
          ]
        );
      } else {
        // Generic QR code
        Alert.alert(
          'QR Code Scanned',
          `Content: ${data}`,
          [
            { text: 'Copy', onPress: () => {
              // In a real app, you'd copy to clipboard
              Alert.alert('Copied', 'QR code content copied to clipboard');
            }},
            { text: 'Close', style: 'cancel' }
          ]
        );
        
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

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handlePermissionRequest = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        'Camera Permission Required',
        'This app needs camera access to scan QR codes. Please enable camera permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() }
        ]
      );
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Checking camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Surface style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.text}>
            To scan QR codes, this app needs access to your camera. Your privacy is important to us - we only use the camera for QR code scanning.
          </Text>
          
          {permission.canAskAgain ? (
            <Button 
              mode="contained" 
              onPress={handlePermissionRequest} 
              style={styles.button}
              icon="camera"
            >
              Grant Camera Permission
            </Button>
          ) : (
            <View>
              <Text style={styles.settingsText}>
                Camera permission was denied. Please enable it in your device settings.
              </Text>
              <Button 
                mode="contained" 
                onPress={() => Linking.openSettings()} 
                style={styles.button}
                icon="cog"
              >
                Open Settings
              </Button>
            </View>
          )}
          
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
        flash={flashEnabled ? 'on' : 'off'}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'aztec', 'ean13', 'ean8', 'upc_e', 'code128', 'code39'],
        }}
      >
        <View style={styles.overlay}>
          {/* Header Controls */}
          <View style={styles.headerControls}>
            {onClose && (
              <IconButton
                icon="close"
                iconColor="#fff"
                size={24}
                onPress={onClose}
                style={styles.headerButton}
              />
            )}
            <View style={styles.spacer} />
            <IconButton
              icon={flashEnabled ? "flash" : "flash-off"}
              iconColor="#fff"
              size={24}
              onPress={toggleFlash}
              style={styles.headerButton}
            />
          </View>

          {/* Scan Area */}
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scanning Line Animation */}
              {!scanned && (
                <View style={styles.scanLine} />
              )}
            </View>
          </View>
          
          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionTitle}>
              Scan QR Code
            </Text>
            <Text style={styles.instructionText}>
              Point your camera at a QR code to scan it
            </Text>
            
            {scanned && (
              <View style={styles.scannedContainer}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.scannedText}>✓ Scanned Successfully!</Text>
                )}
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <Button
              mode="outlined"
              onPress={() => setScanned(false)}
              buttonColor="rgba(255,255,255,0.1)"
              textColor="#fff"
              style={styles.controlButton}
              disabled={loading}
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
const scanAreaSize = Math.min(width * 0.7, 280);

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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  spacer: {
    flex: 1,
  },
  scanAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: scanAreaSize,
    height: scanAreaSize,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  instructionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  scannedContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  scannedText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
  },
  controlButton: {
    minWidth: 120,
  },
  permissionContainer: {
    margin: 20,
    padding: 24,
    alignItems: 'center',
    borderRadius: 12,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  settingsText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    minWidth: 200,
  },
});