import React from 'react';


import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../styles/colors';
import { shadows, borderRadius, spacing, fontSizes } from '../styles/theme';
import { formatPrice } from '../utils/helpers';
import WishlistButton from './WishlistButton';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('ProductDetail', { productId: product.id });
    });
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.wishlistButton}>
          <WishlistButton product={product} />
        </View>
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {product.title}
          </Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: spacing.m,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    ...shadows.small,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    backgroundColor: '#F8F8F8',
  },
  wishlistButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: borderRadius.round,
    padding: spacing.xs,
  },
  content: {
    padding: spacing.m,
  },
  title: {
    fontSize: fontSizes.s,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: fontSizes.m,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default ProductCard;