import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            title: 'TouristMenuQR',
            headerShown: true,
          }} 
        />
        <Stack.Screen 
          name="scanner" 
          options={{ 
            title: 'QR Scanner', 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="restaurant/[id]" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
