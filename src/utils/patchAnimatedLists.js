// src/utils/patchAnimatedLists.js

import { FlatList } from 'react-native';
import { AnimatedFlatList } from '../components/AnimatedListWrapper';

export function patchAnimatedLists() {
  // Override FlatList globally
  Object.assign(FlatList, AnimatedFlatList);

  // VirtualizedList is not patched because AnimatedVirtualizedList doesn't exist
}

