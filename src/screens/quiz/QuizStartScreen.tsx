import React, { RefObject } from 'react';
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { GradientButton } from '@/components/ui';
import DownIcon from '@/assets/icons/downicon.svg';
import UpIcon from '@/assets/icons/upicon.svg';

import { QUIZ_COUNT_OPTIONS } from './QuizQuestionScreen';

interface QuizStartScreenProps {
  quizCount: number | null;
  isDropdownOpen: boolean;
  dropdownPosition: { top: number; left: number };
  triggerRef: RefObject<View | null>;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;
  onSelectCount: (count: number) => void;
  onSolveQuiz: () => void;
}

const QuizStartScreen = ({
  quizCount,
  isDropdownOpen,
  dropdownPosition,
  triggerRef,
  onToggleDropdown,
  onCloseDropdown,
  onSelectCount,
  onSolveQuiz,
}: QuizStartScreenProps) => (
  <View className="flex-1 bg-background px-16 pt-[68px]">
    <Text className="text-center font-notoSansKRBold text-base text-black">
      <Text className="text-purple">분리수거</Text>에 대해 문제를 풀어보세요!
    </Text>

    <View className="mt-12 aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white">
      <Image
        source={require('@/assets/images/char-egg.png')}
        className="h-2/3 w-2/3"
        resizeMode="contain"
      />
    </View>

    <View className="ml-2 mt-12 flex-row items-center">
      <Text className="font-notoSansKRBold text-xl text-black">퀴즈 개수</Text>
      <View ref={triggerRef} className="ml-12">
        <TouchableOpacity
          className="flex-row gap-[69px] rounded-md border border-border bg-white px-2 py-3"
          activeOpacity={0.8}
          onPress={() => (isDropdownOpen ? onCloseDropdown() : onToggleDropdown())}>
          <Text className="font-notoSansKRRegular text-sm text-black">
            {quizCount ? `${quizCount} 개` : '선택'}
          </Text>
          {isDropdownOpen ? <UpIcon width={16} height={16} /> : <DownIcon width={16} height={16} />}
        </TouchableOpacity>
      </View>
    </View>

    <Modal visible={isDropdownOpen} transparent animationType="none">
      <Pressable className="flex-1" onPress={onCloseDropdown}>
        <View
          className="absolute w-36 overflow-hidden rounded-lg border border-border bg-white"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
          {QUIZ_COUNT_OPTIONS.map((count) => (
            <Pressable key={count} className="px-4 py-2" onPress={() => onSelectCount(count)}>
              <Text className="font-notoSansKRRegular text-sm text-black">{count}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>

    <View className="mt-20 px-2">
      <GradientButton
        label="퀴즈 풀기"
        onPress={onSolveQuiz}
        height={50}
        borderRadius={28}
        disabled={!quizCount}
      />
    </View>
  </View>
);

export default QuizStartScreen;
