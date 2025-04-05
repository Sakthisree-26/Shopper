import React from 'react';


import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { spacing, borderRadius, shadows } from '../styles/theme';

const SearchBar = ({ value, onChangeText, onFilterPress }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(scaleAnim, {
      toValue: 1.02,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        isFocused && styles.focused,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.gray}
        />
        {value ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <AntDesign name="close" size={16} color={colors.gray} />
          </TouchableOpacity>
        ) : null}
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Feather name="filter" size={20} color={colors.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.xs,
    marginBottom: spacing.m,
    ...shadows.small,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginHorizontal: spacing.s,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.s,
    fontSize: 16,
    color: colors.textPrimary,
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    padding: spacing.s,
    marginLeft: spacing.xs,
    borderLeftWidth: 1,
    borderLeftColor: colors.lightGray,
  },
});

export default SearchBar;