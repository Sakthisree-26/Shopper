import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { colors } from './src/styles/colors';

// Import and patch Animated lists before rendering the app
import { patchAnimatedLists } from './src/utils/patchAnimatedLists';
patchAnimatedLists(); // Apply the patch

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <CartProvider>
        <WishlistProvider>
          <AppNavigator />
        </WishlistProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}
