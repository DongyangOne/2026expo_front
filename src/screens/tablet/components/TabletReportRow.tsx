import React, { memo } from 'react';
import { Text, View } from 'react-native';

import type { AdminFeedback } from '@/types';

import TabletReportColumnDivider from './TabletReportColumnDivider';

interface TabletReportRowProps {
  feedback: AdminFeedback;
}

const WORD_JOINER = '\u2060';

const keepWordsTogether = (content: string): string =>
  content.replace(/[^\s]+/g, (word) => [...word].join(WORD_JOINER));

const TabletReportRow = ({ feedback }: TabletReportRowProps) => (
  <View
    className={`mb-[9px] min-h-[159px] w-full flex-row overflow-visible rounded-[10px] ${
      feedback.isSuccess ? 'bg-success/[0.08]' : 'bg-linear-start/[0.08]'
    }`}>
    <View className="w-[323px] items-center justify-center">
      <Text className="text-center font-notoSansKRBold text-xl text-body">{feedback.time}</Text>
      <TabletReportColumnDivider />
    </View>
    <View className="w-[366px] items-center justify-center">
      <Text className="text-center font-notoSansKRBold text-xl text-body">{feedback.username}</Text>
      <TabletReportColumnDivider />
    </View>
    <View className="min-w-0 flex-1 items-center justify-center px-6 py-4">
      <Text
        className="w-3/4 max-w-[520px] text-center font-notoSansKRBold text-xl leading-8 text-body"
        textBreakStrategy="balanced">
        {keepWordsTogether(feedback.content)}
      </Text>
    </View>
  </View>
);

export default memo(TabletReportRow);
