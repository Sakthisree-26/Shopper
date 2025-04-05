import React from 'react';
import { useState} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSizes, shadows } from '../styles/theme';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { PatchedFlatList } from '../components/AnimatedListWrapper';




const CartScreen = ({ navigation }) => {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const [checkoutButtonScale] = useState(new Animated.Value(1));

  const handleCheckout = () => {
    Animated.sequence([
      Animated.timing(checkoutButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkoutButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      alert('Checkout functionality would be implemented here!');
    });
  };

  const renderItem = ({ item }) => <CartItem item={item} />;

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon="shoppingcart"
        title="Your Cart is Empty"
        message="Looks like you haven't added any products to your cart yet."
        buttonText="Start Shopping"
        onButtonPress={() => navigation.navigate('HomeTab')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PatchedFlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Your Cart ({cartItems.length})</Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.footerLabel}>Subtotal</Text>
          <Text style={styles.footerValue}>{formatPrice(getTotalPrice())}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.footerLabel}>Shipping</Text>
          <Text style={styles.footerValue}>FREE</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(getTotalPrice())}</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: checkoutButtonScale }] }}>
          <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.8}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
            <AntDesign name="arrowright" size={20} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: fontSizes.s,
  },
  list: {
    padding: spacing.m,
    paddingBottom: 220, // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.l,
    borderTopRightRadius: borderRadius.l,
    padding: spacing.l,
    ...shadows.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  footerLabel: {
    fontSize: fontSizes.m,
    color: colors.textSecondary,
  },
  footerValue: {
    fontSize: fontSizes.m,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: spacing.m,
    marginBottom: spacing.l,
  },
  totalLabel: {
    fontSize: fontSizes.l,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: fontSizes.l,
    fontWeight: 'bold',
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.m,
    paddingVertical: spacing.m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: fontSizes.m,
    fontWeight: '600',
    marginRight: spacing.s,
  },
});

export default CartScreen;
