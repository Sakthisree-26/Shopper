import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_ITEMS_KEY = '@ecommerce_app:cart_items';
const WISHLIST_ITEMS_KEY = '@ecommerce_app:wishlist_items';

export const saveCartItems = async (cartItems) => {
  try {
    await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart items:', error);
  }
};

export const loadCartItems = async () => {
  try {
    const cartItemsString = await AsyncStorage.getItem(CART_ITEMS_KEY);
    return cartItemsString ? JSON.parse(cartItemsString) : [];
  } catch (error) {
    console.error('Error loading cart items:', error);
    return [];
  }
};

export const saveWishlistItems = async (wishlistItems) => {
  try {
    await AsyncStorage.setItem(WISHLIST_ITEMS_KEY, JSON.stringify(wishlistItems));
  } catch (error) {
    console.error('Error saving wishlist items:', error);
  }
};

export const loadWishlistItems = async () => {
  try {
    const wishlistItemsString = await AsyncStorage.getItem(WISHLIST_ITEMS_KEY);
    return wishlistItemsString ? JSON.parse(wishlistItemsString) : [];
  } catch (error) {
    console.error('Error loading wishlist items:', error);
    return [];
  }
};