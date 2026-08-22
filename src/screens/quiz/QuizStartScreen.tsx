import React, { useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { GradientButton } from '@/components/ui';
import DownIcon from '@/assets/icons/downicon.svg';
import UpIcon from '@/assets/icons/upicon.svg';
import charEggImage from '@/assets/images/char-egg.png';

import { QUIZ_COUNT_OPTIONS } from './QuizQuestionScreen';

interface QuizStartScreenProps {
  quizCount: number | null;
  onSelectCount: (count: number) => void;
  onSolveQuiz: () => void;
  isLoading?: boolean;
}

const QuizStartScreen = ({
  quizCount,
  onSelectCount,
  onSolveQuiz,
  isLoading = false,
}: QuizStartScreenProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectCount = (count: number): void => {
    onSelectCount(count);
    setIsDropdownOpen(false);
  };

  return (
    <View className="flex-1 bg-background px-16 pt-[68px]">
      <Text className="text-center font-notoSansKRBold text-base text-black">
        <Text className="text-purple">분리수거</Text>에 대해 문제를 풀어보세요!
      </Text>

      <View className="mt-12 aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl bg-background">
        <Image source={charEggImage} className="h-2/3 w-2/3" resizeMode="contain" />
      </View>

      <View className="z-20 ml-2 mt-12 flex-row items-center">
        <Text className="font-notoSansKRBold text-xl text-black">퀴즈 개수</Text>
        <View className="ml-12" style={{ position: 'relative' }}>
          <TouchableOpacity
            className="flex-row gap-[69px] rounded-md border border-border bg-white px-2 py-3"
            activeOpacity={0.8}
            onPress={() => setIsDropdownOpen((prev) => !prev)}>
            <Text className="font-notoSansKRRegular text-sm text-black">
              {quizCount ? `${quizCount} 개` : '선택'}
            </Text>
            {isDropdownOpen ? (
              <UpIcon width={16} height={16} />
            ) : (
              <DownIcon width={16} height={16} />
            )}
          </TouchableOpacity>

          {isDropdownOpen && (
            <View
              className="absolute w-36 overflow-hidden rounded-lg border border-border bg-white"
              style={{ top: '100%', left: 0, marginTop: 4 }}>
              {QUIZ_COUNT_OPTIONS.map((count) => (
                <Pressable
                  key={count}
                  className="px-4 py-2"
                  onPress={() => handleSelectCount(count)}>
                  <Text className="font-notoSansKRRegular text-sm text-black">{count}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {isDropdownOpen && (
        <Pressable
          className="absolute inset-0 z-10"
          onPress={() => setIsDropdownOpen(false)}
        />
      )}

      <View className="mt-20 px-2">
        <GradientButton
          label={isLoading ? '불러오는 중...' : '퀴즈 풀기'}
          onPress={onSolveQuiz}
          height={50}
          borderRadius={28}
          disabled={!quizCount || isLoading}
        />
      </View>
    </View>
  );
};

export default QuizStartScreen;
