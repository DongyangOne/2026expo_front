import React from 'react';
import { Pressable, View } from 'react-native';

import CameraIcon from '@/assets/icons/camera.svg';
import GradientOvalButton from '@/assets/icons/gradient-oval-button.svg';

interface CameraFabProps {
  onPress: () => void;
}

export const CAMERA_FAB_SIZE = 57;
export const CAMERA_FAB_BOTTOM_OFFSET = 24;

const ICON_SIZE = 29;

/** 위치 고정 카메라 플로팅 버튼. 누르면 휴대폰 기본 카메라 앱으로 이동한다. */
const CameraFab = ({ onPress }: CameraFabProps) => {
  return (
    <Pressable
      accessibilityLabel="카메라 열기"
      accessibilityRole="button"
      className="absolute right-[19px]"
      onPress={onPress}
      style={{ bottom: CAMERA_FAB_BOTTOM_OFFSET }}>
      <GradientOvalButton height={CAMERA_FAB_SIZE} width={CAMERA_FAB_SIZE} />
      <View className="absolute inset-0 items-center justify-center">
        <CameraIcon height={ICON_SIZE} width={ICON_SIZE} />
      </View>
    </Pressable>
  );
};

export default CameraFab;
