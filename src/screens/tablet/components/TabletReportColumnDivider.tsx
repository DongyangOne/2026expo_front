import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const TabletReportColumnDivider = () => (
  <View className="absolute -right-[6px] bottom-0 top-0 z-[2] w-[6px]" pointerEvents="none">
    <Svg height="100%" width="100%">
      <Defs>
        <LinearGradient id="column-divider-shadow" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#000000" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#000000" stopOpacity="0.03" />
          <Stop offset="1" stopColor="#000000" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect fill="url(#column-divider-shadow)" height="100%" width="100%" />
    </Svg>
  </View>
);

export default TabletReportColumnDivider;
