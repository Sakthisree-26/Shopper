import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSizes } from '../styles/theme';
import { AntDesign } from '@expo/vector-icons';
import { PatchedFlatList } from '../components/AnimatedListWrapper';

const categories = [
  'all',
  'electronics',
  'clothing',
  'books',
  'furniture',
  'sports',
  'beauty',
  'toys',
];

const FilterModal = ({
  visible,
  onClose,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [tempCategory, setTempCategory] = useState(selectedCategory);

  useEffect(() => {
    setTempCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter by Category</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <PatchedFlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.flatList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  tempCategory === item && styles.selectedCategoryItem,
                ]}
                onPress={() => setTempCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    tempCategory === item && styles.selectedCategoryText,
                  ]}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              setSelectedCategory(tempCategory);
              onClose();
            }}
          >
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.l,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: fontSizes.l,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  flatList: {
    paddingVertical: spacing.s,
  },
  categoryItem: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.m,
    backgroundColor: colors.lightGray,
    marginRight: spacing.s,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: fontSizes.m,
    color: colors.textPrimary,
  },
  selectedCategoryText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  applyButton: {
    marginTop: spacing.l,
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.white,
    fontSize: fontSizes.m,
    fontWeight: 'bold',
  },
});

export default FilterModal;
