import React from 'react';
import { useWindowDimensions, View } from 'react-native';

const BackgroundCircles = () => {
  const { width, height } = useWindowDimensions();

  return (
    <>
      <View
        className="absolute rounded-full bg-pink opacity-20"
        style={{
          height: width * 0.75,
          width: width * 0.75,
          right: -width * 0.3,
          top: -width * 0.15,
        }}
      />
      <View
        className="absolute rounded-full bg-purple opacity-20"
        style={{
          height: width * 0.6,
          width: width * 0.6,
          left: -width * 0.25,
          bottom: -width * 0.1,
        }}
      />
      <View
        className="absolute rounded-full bg-pink opacity-10"
        style={{
          height: width * 0.15,
          width: width * 0.15,
          left: width * 0.08,
          bottom: height * 0.22,
        }}
      />
    </>
  );
};

export default BackgroundCircles;
