import React from 'react';
import  { useState, useEffect,useRef } from 'react';

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { fetchProductById } from '../api/apiService';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSizes, shadows } from '../styles/theme';
import { formatPrice } from '../utils/helpers';
import Loading from '../components/Loading';
import WishlistButton from '../components/WishlistButton';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });
  
  const imageTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [0, 0, -50],
    extrapolate: 'clamp',
  });
  
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(`Error loading product ${productId}:`, error);
        setLoading(false);
        navigation.goBack();
      }
    };
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      addToCart(product);
      // Show feedback animation or message
    });
  };

  if (loading || !product) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <Text numberOfLines={1} style={styles.headerTitle}>
          {product.title}
        </Text>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <Animated.View
            style={{
              transform: [
                { scale: imageScale },
                { translateY: imageTranslateY },
              ],
            }}
          >
            <Image source={{ uri: product.image }} style={styles.image} />
          </Animated.View>
          <View style={styles.wishlistButtonContainer}>
            <WishlistButton product={product} size={26} />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.category}>
              {product.category.toUpperCase()}
            </Text>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={18} color="#FFD700" />
              <Text style={styles.rating}>
                {product.rating?.rate || 0} ({product.rating?.count || 0} reviews)
              </Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.priceFooter}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>{formatPrice(product.price)}</Text>
          </View>
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={styles.addToCartButton}
              activeOpacity={0.8}
              onPress={handleAddToCart}
            >
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: colors.white,
    zIndex: 1000,
    paddingTop: 40,
    paddingHorizontal: spacing.l,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
  },
  wishlistButtonContainer: {
    position: 'absolute',
    top: spacing.l + StatusBar.currentHeight,
    right: spacing.l,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: borderRadius.round,
    padding: spacing.xs,
  },
  contentContainer: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.l,
  },
  category: {
    fontSize: fontSizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.s,
    color: colors.textSecondary,
  },
  priceContainer: {
    marginBottom: spacing.l,
  },
  price: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  description: {
    fontSize: fontSizes.m,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingBottom: spacing.s,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  priceFooter: {
    marginRight: spacing.l,
  },
  priceLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: fontSizes.l,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.m,
    paddingVertical: spacing.m,
    alignItems: 'center',
    ...shadows.small,
  },
  addToCartButtonText: {
    color: colors.white,
    fontSize: fontSizes.m,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;