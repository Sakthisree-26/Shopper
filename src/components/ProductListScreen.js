import React from 'react';
import  { useState, useEffect } from 'react';

import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import EmptyState from '../components/EmptyState';
import {
  fetchProducts,
  fetchProductsByCategory,
} from '../api/apiService';
import { spacing } from '../styles/theme';
import { colors } from '../styles/colors';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    applySearchFilter(search);
  }, [search, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedCategory === 'all') {
        data = await fetchProducts();
      } else {
        data = await fetchProductsByCategory(selectedCategory);
      }
      setProducts(data);
      setFiltered(data); // Reset filtered list
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = (query) => {
    if (!query) {
      setFiltered(products);
      return;
    }
    const lower = query.toLowerCase();
    const filteredData = products.filter((item) =>
      item.title.toLowerCase().includes(lower)
    );
    setFiltered(filteredData);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        onFilterPress={() => setFilterModalVisible(true)}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Products Found"
          message="Try changing your search or filter."
          buttonText="Clear Search"
          onButtonPress={() => setSearch('')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.m,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  productCard: {
    padding: spacing.m,
    marginBottom: spacing.s,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 2,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  productPrice: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.primary,
  },
});

export default ProductListScreen;
