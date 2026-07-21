import React from 'react';
import { Image, useWindowDimensions, View } from 'react-native';

import CheckImage from '@/assets/images/체크이미지.png';

const IMAGE_ASPECT_RATIO = 250 / 375;

const CompleteCheckBadge = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width, height: width * IMAGE_ASPECT_RATIO }}>
      <Image resizeMode="contain" source={CheckImage} style={{ height: '100%', width: '100%' }} />
    </View>
  );
};

export default CompleteCheckBadge;
