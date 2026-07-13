import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface AgreementCancelModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AgreementCancelModal = ({ visible, onCancel, onConfirm }: AgreementCancelModalProps) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <Pressable className="flex-1 items-center justify-center bg-black/40" onPress={onCancel}>
        <Pressable
          className="w-[280px] rounded-[16px] bg-white px-[24px] pb-[16px] pt-[28px]"
          onPress={() => {}}>
          <Text
            className="text-center font-notoSansKRDemiLight text-sm text-black"
            style={{ includeFontPadding: false }}>
            이용약관 동의를 해제하시겠습니까?
          </Text>

          <View className="mt-[24px] flex-row">
            <Pressable
              className="h-[44px] flex-1 items-center justify-center rounded-[10px] bg-disabledBg"
              onPress={onCancel}>
              <Text
                className="font-notoSansKRRegular text-sm text-body"
                style={{ includeFontPadding: false }}>
                취소
              </Text>
            </Pressable>

            <Pressable
              className="ml-[10px] h-[44px] flex-1 items-center justify-center rounded-[10px] bg-error"
              onPress={onConfirm}>
              <Text
                className="font-notoSansKRRegular text-sm text-white"
                style={{ includeFontPadding: false }}>
                동의 해제
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AgreementCancelModal;
