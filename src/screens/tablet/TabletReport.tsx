import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { FONTS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { clearAdminSession } from '@/services';
import { useAuthStore } from '@/store';

type Props = NativeStackScreenProps<RootStackParamList, 'TabletReport'>;

type ReportRow = {
  time: string;
  user: string;
  content: string;
  tone: 'normal' | 'warning';
};

type ReportGroup = {
  date: string;
  rows: ReportRow[];
};

const REPORT_GROUPS: ReportGroup[] = [
  {
    date: '2026.05.06',
    rows: [
      {
        time: '13 : 34',
        user: '최예은',
        content: '캔을 올바르게 분리수거 하셨어요',
        tone: 'normal',
      },
      {
        time: '13 : 34',
        user: '최예은',
        content: '캔을 올바르게 분리수거 하셨어요',
        tone: 'normal',
      },
      {
        time: '13 : 34',
        user: '최예은',
        content: '올바른 분리수거가 이루어지지 않았어요\n(캔에 음식물이 들어있었음)',
        tone: 'warning',
      },
    ],
  },
  {
    date: '2026.05.06',
    rows: [
      {
        time: '13 : 34',
        user: '최예은',
        content: '올바른 분리수거가 이루어지지 않았어요\n(캔에 음식물이 들어있었음)',
        tone: 'warning',
      },
    ],
  },
];

const TABLE_COLUMNS = [
  { key: 'time', label: '바뀐 시간', widthClassName: 'w-[323px]' },
  { key: 'user', label: '사용자', widthClassName: 'w-[366px]' },
  { key: 'content', label: '분리수거 내용', widthClassName: 'min-w-0 flex-1' },
] as const;

const ColumnDivider = () => (
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

const BackGradientText = () => (
  <Svg height={18} width={58}>
    <Defs>
      <LinearGradient id="report-back-text-gradient" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#7B61FF" />
        <Stop offset="1" stopColor="#FF4FD8" />
      </LinearGradient>
    </Defs>
    <SvgText
      fill="url(#report-back-text-gradient)"
      fontFamily={FONTS.regular}
      fontSize={15}
      textAnchor="middle"
      x={29}
      y={13}>
      뒤로가기
    </SvgText>
  </Svg>
);

const TabletReport = ({ navigation }: Props) => {
  const adminLogout = useAuthStore((state) => state.adminLogout);

  const handleBackPress = () => {
    Alert.alert('로그아웃', '로그아웃됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          await clearAdminSession();
          adminLogout();
          navigation.replace('TabletMain');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="">
          {REPORT_GROUPS.map((group, groupIndex) => (
            <View key={`${group.date}-${groupIndex}`}>
              <View className="my-[30px] ml-[37px] flex-row items-center justify-between">
                <Text className="font-notoSansKRBold text-2xl text-black">{group.date}</Text>
                {groupIndex === 0 ? (
                  <Pressable
                    className="mr-[25px] h-[50px] w-[210px] items-center justify-center overflow-hidden rounded-full"
                    onPress={handleBackPress}>
                    <Svg height="100%" style={StyleSheet.absoluteFill} width="100%">
                      <Defs>
                        <LinearGradient
                          id="report-back-border-gradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0">
                          <Stop offset="0" stopColor="#7B61FF" />
                          <Stop offset="1" stopColor="#FF4FD8" />
                        </LinearGradient>
                      </Defs>
                      <Rect
                        fill="transparent"
                        height="49"
                        rx="24.5"
                        stroke="url(#report-back-border-gradient)"
                        strokeWidth="1"
                        width="209"
                        x="0.5"
                        y="0.5"
                      />
                    </Svg>
                    <BackGradientText />
                  </Pressable>
                ) : null}
              </View>

              <View className="mb-[9px] w-full flex-row overflow-visible rounded-[4px] bg-purple/[0.08]">
                {TABLE_COLUMNS.map((column, columnIndex) => (
                  <View
                    key={column.key}
                    className={`${column.widthClassName} h-[91px] items-center justify-center`}>
                    <Text className="font-notoSansKRBold text-xl text-black">{column.label}</Text>
                    {columnIndex < TABLE_COLUMNS.length - 1 ? <ColumnDivider /> : null}
                  </View>
                ))}
              </View>

              {group.rows.map((row, rowIndex) => (
                <View
                  key={`${row.time}-${row.user}-${rowIndex}`}
                  className={`mb-[9px] min-h-[159px] w-full flex-row overflow-visible rounded-[10px] ${
                    row.tone === 'warning' ? 'bg-linear-start/[0.08]' : 'bg-success/[0.08]'
                  }`}>
                  {TABLE_COLUMNS.map((column, columnIndex) => (
                    <View
                      key={column.key}
                      className={`${column.widthClassName} items-center justify-center`}>
                      <Text className="text-center font-notoSansKRBold text-xl text-body">
                        {row[column.key]}
                      </Text>
                      {columnIndex < TABLE_COLUMNS.length - 1 ? <ColumnDivider /> : null}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TabletReport;
