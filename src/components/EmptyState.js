import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { spacing, fontSizes } from '../styles/theme';

const EmptyState = ({ 
  icon = 'shoppingcart', 
  title = 'No items found', 
  message = 'There are no items to display at this time', 
  buttonText,
  onButtonPress
}) => {
  return (
    <View style={styles.container}>
      <AntDesign name={icon} size={64} color={colors.gray} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.l,
    marginBottom: spacing.s,
  },
  message: {
    fontSize: fontSizes.m,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    borderRadius: 999,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default EmptyState;