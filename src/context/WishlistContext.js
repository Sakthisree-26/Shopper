import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveWishlistItems, loadWishlistItems } from '../utils/asyncStorage';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      const items = await loadWishlistItems();
      setWishlistItems(items);
      setLoading(false);
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveWishlistItems(wishlistItems);
    }
  }, [wishlistItems, loading]);

  const addToWishlist = (product) => {
    setWishlistItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems;
      }
      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};