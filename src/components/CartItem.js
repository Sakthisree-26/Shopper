import React from 'react';


import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSizes } from '../styles/theme';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      removeFromCart(item.id);
    });
  };

  const incrementQuantity = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
        updateQuantity(item.id, item.quantity - 1);
      } else {
        handleRemove();
      }
    };
  
    return (
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <View style={styles.actions}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <AntDesign name="minus" size={16} color={colors.gray} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <AntDesign name="plus" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
              <AntDesign name="delete" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderRadius: borderRadius.m,
      padding: spacing.s,
      marginBottom: spacing.m,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    image: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
      borderRadius: borderRadius.s,
      backgroundColor: '#F8F8F8',
      marginRight: spacing.m,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: fontSizes.m,
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    price: {
      fontSize: fontSizes.m,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: spacing.s,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: borderRadius.s,
    },
    quantityButton: {
      padding: spacing.xs,
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantity: {
      paddingHorizontal: spacing.s,
      fontSize: fontSizes.m,
      fontWeight: '500',
      minWidth: 30,
      textAlign: 'center',
    },
    removeButton: {
      padding: spacing.xs,
    },
  });
  
  export default CartItem;