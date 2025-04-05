// components/AnimatedListWrapper.js

import React from 'react';
import { Animated, FlatList } from 'react-native';


export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


//const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

//export { AnimatedFlatList };

export const PatchedFlatList = (props) => {
  return <AnimatedFlatList {...props} />;
};
