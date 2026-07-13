import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';

type BackgroundCircle = {
  color: string;
  sizeRatio: number;
  anchor: 'top' | 'bottom';
  pos: readonly [number, number];
};

const TabletBackgroundCircles = () => {
  const { width, height } = useWindowDimensions();
  const backgroundCircles = useMemo<BackgroundCircle[]>(
    () => [
      {
        color: 'bg-pink',
        sizeRatio: 0.32,
        anchor: 'top',
        pos: [-0.126, -0.164],
      },
      {
        color: 'bg-pink',
        sizeRatio: 0.197,
        anchor: 'top',
        pos: [0.021, 0.158],
      },
      {
        color: 'bg-pink',
        sizeRatio: 0.055,
        anchor: 'top',
        pos: [0.126, 0.55],
      },
      {
        color: 'bg-purple',
        sizeRatio: 0.32,
        anchor: 'bottom',
        pos: [0.77, -0.158],
      },
      {
        color: 'bg-purple',
        sizeRatio: 0.148,
        anchor: 'bottom',
        pos: [0.77, 0.17],
      },
      {
        color: 'bg-purple',
        sizeRatio: 0.047,
        anchor: 'bottom',
        pos: [0.835, 0.45],
      },
    ],
    [],
  );

  return (
    <>
      {backgroundCircles.map((circle, index) => {
        const diameter = circle.sizeRatio * width;

        return (
          <View
            key={`${circle.color}-${index}`}
            className={`absolute rounded-full ${circle.color} opacity-15`}
            style={{
              height: diameter,
              width: diameter,
              left: circle.pos[0] * width,
              ...(circle.anchor === 'top'
                ? { top: circle.pos[1] * height }
                : { bottom: circle.pos[1] * height }),
            }}
          />
        );
      })}
    </>
  );
};

export default TabletBackgroundCircles;
