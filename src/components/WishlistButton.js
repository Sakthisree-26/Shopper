import React from 'react';




import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { useWishlist } from '../context/WishlistContext';

const WishlistButton = ({ product, size = 24 }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleWishlist}
      activeOpacity={0.7}
      style={styles.button}
    >
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <AntDesign
          name={isWishlisted ? 'heart' : 'hearto'}
          size={size}
          color={isWishlisted ? colors.error : colors.gray}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});

export default WishlistButton;