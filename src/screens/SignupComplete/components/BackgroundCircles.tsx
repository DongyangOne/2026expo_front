import React from 'react';
import { useWindowDimensions, View } from 'react-native';

const BackgroundCircles = () => {
  const { width, height } = useWindowDimensions();

  return (
    <>
      <View
        className="absolute rounded-full bg-pink"
        style={{
          height: width * 1.05,
          width: width * 1.05,
          left: -width * 0.85,
          top: -width * 0.35,
          opacity: 0.15,
        }}
      />
      <View
        className="absolute rounded-full bg-purple"
        style={{
          height: width * 1.05,
          width: width * 1.05,
          right: -width * 0.35,
          bottom: -height * 0.12,
          opacity: 0.15,
        }}
      />
    </>
  );
};

export default BackgroundCircles;
