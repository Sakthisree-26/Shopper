import React from 'react';


import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { colors } from '../styles/colors';
import { spacing, fontSizes } from '../styles/theme';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { useWishlist } from '../context/WishlistContext';
import { PatchedFlatList } from '../components/AnimatedListWrapper';


const WishlistScreen = ({ navigation }) => {
  const { wishlistItems } = useWishlist();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ProductCard product={item} />
    </View>
  );

  if (wishlistItems.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Your Wishlist is Empty"
        message="Looks like you haven't added any products to your wishlist yet."
        buttonText="Start Shopping"
        onButtonPress={() => navigation.navigate('HomeTab')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PatchedFlatList
        data={wishlistItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Your Wishlist ({wishlistItems.length})
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: spacing.m,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  list: {
    padding: spacing.m,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.m,
  },
});

export default WishlistScreen;
