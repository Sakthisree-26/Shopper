import React from 'react';
import { useState, useEffect,useCallback } from 'react';

import { StyleSheet, Animated, RefreshControl, SafeAreaView, FlatList } from 'react-native';
import { AnimatedFlatList } from '../components/AnimatedListWrapper';
import { fetchProducts, fetchProductsByCategory } from '../api/apiService';
import { colors } from '../styles/colors';
import { spacing } from '../styles/theme';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterModal from '../components/FilterModal';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { debounce } from '../utils/helpers';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  // We keep a filters object; here we extract the category for FilterModal.
  const [filters, setFilters] = useState({
    category: null,
    sortBy: 'default',
  });

  const scrollY = new Animated.Value(0);

  const loadProducts = async (category = null) => {
    try {
      setLoading(true);
      const data = category
        ? await fetchProductsByCategory(category)
        : await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(filters.category);
  }, [filters.category]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products, searchQuery, filters.sortBy]);

  const applyFilters = () => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.sortBy === 'priceLowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHighToLow') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  };

  const handleSearch = useCallback(
    debounce((text) => {
      setSearchQuery(text);
    }, 300),
    []
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts(filters.category);
    setRefreshing(false);
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  // When a new filter is applied via other means, update our filters state.
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const renderItem = ({ item }) => <ProductCard product={item} />;

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.searchBarContainer,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, -10],
                  extrapolate: 'clamp',
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0.9],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
          onFilterPress={handleFilterPress}
        />
      </Animated.View>

      {filteredProducts.length > 0 ? (
        <AnimatedFlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      ) : (
        <EmptyState
          icon="search1"
          title="No Products Found"
          message="We couldn't find any products matching your search or filter criteria."
          buttonText="Reset Filters"
          onButtonPress={() => {
            setSearchQuery('');
            setFilters({ category: null, sortBy: 'default' });
          }}
        />
      )}

      {/* Pass selectedCategory and a function to update the category */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategory={filters.category || 'all'}
        setSelectedCategory={(category) =>
          setFilters((prev) => ({ ...prev, category: category === 'all' ? null : category }))
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
  searchBarContainer: {
    padding: spacing.m,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  listContainer: {
    padding: spacing.m,
    paddingTop: 0,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
