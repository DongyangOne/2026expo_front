import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

import PlaceholderCircle from './PlaceholderCircle';

export interface RecyclingLogEntry {
  id: string;
  date: string;
  category: string;
  image?: ImageSourcePropType;
}

interface RecyclingLogItemProps {
  entry: RecyclingLogEntry;
  onPress: (entry: RecyclingLogEntry) => void;
}

const THUMBNAIL_SIZE = 78;

/** 분리수거 로그 한 줄: 재료별 이미지 + 버린 날짜 + 종류. 누르면 피드백 탭으로 이동한다. */
const RecyclingLogItem = ({ entry, onPress }: RecyclingLogItemProps) => {
  return (
    <Pressable
      className="flex-row items-center rounded-[9.5px] border border-border bg-white p-[3.5px]"
      onPress={() => onPress(entry)}>
      <PlaceholderCircle size={THUMBNAIL_SIZE} source={entry.image} />

      <View className="ml-[20px]">
        <Text className="font-notoSansKRRegular text-sm text-body">{entry.date}</Text>
        <Text className="mt-[15px] font-notoSansKRBold text-lg text-black">{entry.category}</Text>
      </View>
    </Pressable>
  );
};

export default RecyclingLogItem;
