import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { GradientButton } from '@/components/ui';
import type { RootTabParamList } from '@/navigation/types';
import QuizFinalResultScreen from '@/screens/quiz/QuizFinalResultScreen';
import QuizQuestionScreen, { QuizQuestion } from '@/screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import QuizStartScreen from '@/screens/quiz/QuizStartScreen';
import {
  finishQuizSession,
  finishRetrySession,
  startQuizSession,
  startRetrySession,
  submitQuizAnswer,
  submitRetryAnswer,
} from '@/services/quiz.service';
import type { QuizResultData } from '@/types';
import { COLORS } from '@/constants/theme';

type Props = BottomTabScreenProps<RootTabParamList, 'Quiz'>;

/** 지정 개수만큼 빈 QuizQuestion 배열을 생성한다. 실제 문항 내용은 API 응답으로 채워진다. */
const generatePlaceholders = (count: number): QuizQuestion[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    question: '',
    answer: false,
    explanation: '',
  }));

const QuizScreen = ({ route, navigation }: Props): React.JSX.Element => {
  const [quizCount, setQuizCount] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState('');
  const [apiFinished, setApiFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [isSettleFailed, setIsSettleFailed] = useState(false);
  /** 다시풀기 모드 여부. true이면 retry 전용 API를 사용한다. */
  const [isRetryMode, setIsRetryMode] = useState(false);
  /** 원본 퀴즈 세션 ID. 다시풀기 시작 시 이 ID로 retry API를 호출한다. */
  const [originalSessionId, setOriginalSessionId] = useState<string | null>(null);
  // 세션 실행 토큰: 새 퀴즈 시작/종료 시 갱신해 이전 요청의 응답을 무효화한다.
  const sessionRunRef = useRef(0);
  // "다음" 연타로 결과 정산 요청이 중복 전송되는 것을 막는 동기 락. state는 리렌더 전까지 갱신되지 않아 사용할 수 없다.
  const isSettlingRef = useRef(false);

  /** 퀴즈 시작/다시풀기 후 공통 상태를 초기화한다. */
  const resetQuizState = (newSessionId: string, questions: QuizQuestion[]): void => {
    setSessionId(newSessionId);
    setQuizQuestions(questions);
    setCurrentIndex(0);
    setIsCorrect(null);
    setExplanation('');
    setApiFinished(false);
    setQuizResult(null);
    setIsSubmitting(false);
    setIsSettling(false);
    setIsSettleFailed(false);
    setIsFinished(false);
    setIsPlaying(true);
  };

  const handleSolveQuiz = async (): Promise<void> => {
    if (!quizCount || isStarting) return;

    setIsStarting(true);
    try {
      const { data } = await startQuizSession({ quantity: quizCount });

      sessionRunRef.current += 1;

      const questions = generatePlaceholders(quizCount);
      if (questions.length > 0) {
        questions[0] = { ...questions[0], id: data.quizId, question: data.question };
      }

      setIsRetryMode(false);
      setOriginalSessionId(data.sessionId);
      resetQuizState(data.sessionId, questions);
    } catch (err: unknown) {
      console.error('[QuizScreen] startQuizSession error:', err);
      // instance.ts 인터셉터가 message만 실어서 Error로 던지므로 code(QUIZ_NOT_FOUND 등)로는 분기 불가. message로 처리.
      const message = err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('퀴즈를 시작할 수 없어요', message);
    } finally {
      setIsStarting(false);
    }
  };

  /** 틀린 문제만 모아 다시풀기를 시작한다. 갯수 제한 없이 틀린 문제 전체를 다시 풀게 된다. */
  const handleRetryQuiz = useCallback(async (customSessionId?: string): Promise<void> => {
    const targetSessionId = customSessionId || originalSessionId;
    if (!targetSessionId || isStarting) return;

    setIsStarting(true);
    try {
      const { data } = await startRetrySession(targetSessionId);

      sessionRunRef.current += 1;

      const questions = generatePlaceholders(data.totalCount);
      if (questions.length > 0) {
        questions[0] = { ...questions[0], id: data.quizId, question: data.question };
      }

      setIsRetryMode(true);
      setOriginalSessionId(targetSessionId);
      resetQuizState(data.sessionId, questions);
    } catch (err: unknown) {
      console.error('[QuizScreen] startRetrySession error:', err);
      const message = err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('다시풀기를 시작할 수 없어요', message);
    } finally {
      setIsStarting(false);
    }
  }, [originalSessionId, isStarting]);

  // 홈 화면 "다시 풀기" 버튼으로 진입 시 전달받은 retrySessionId로 자동으로 다시풀기를 시작한다.
  useEffect(() => {
    const targetSessionId = route.params?.retrySessionId || (route.params?.retry ? originalSessionId : undefined);
    if (targetSessionId) {
      navigation.setParams({ retrySessionId: undefined, retry: undefined });
      void handleRetryQuiz(targetSessionId);
    }
  }, [route.params?.retrySessionId, route.params?.retry, originalSessionId, handleRetryQuiz, navigation]);

  const handleCloseQuiz = (): void => {
    setIsExitConfirmOpen(true);
  };

  const handleCancelExit = (): void => {
    setIsExitConfirmOpen(false);
  };

  const handleConfirmExit = (): void => {
    setIsExitConfirmOpen(false);
    setIsPlaying(false);
    setIsSubmitting(false);
    setIsSettling(false);
    setIsSettleFailed(false);
    setIsRetryMode(false);
    sessionRunRef.current += 1;
  };

  const handleAnswer = async (selected: boolean): Promise<void> => {
    if (!sessionId || isSubmitting) return;

    const currentQuestion = quizQuestions[currentIndex];
    const runToken = sessionRunRef.current;

    setIsSubmitting(true);
    try {
      const submitFn = isRetryMode ? submitRetryAnswer : submitQuizAnswer;
      const { data } = await submitFn(sessionId, {
        currentQuizId: currentQuestion.id,
        answer: selected ? 'O' : 'X',
      });

      // 응답이 도착하기 전에 세션이 종료/재시작되었으면 이전 요청의 결과는 버린다.
      if (sessionRunRef.current !== runToken) return;

      setExplanation(data.explan);
      setApiFinished(data.finished);

      if (!data.finished) {
        const nextIdx = currentIndex + 1;
        setQuizQuestions((prev) => {
          if (nextIdx >= prev.length) return prev;
          const next = [...prev];
          next[nextIdx] = {
            ...next[nextIdx],
            id: data.nextQuizId,
            question: data.nextQuestion,
          };
          return next;
        });
      }

      setIsCorrect(data.isCorrect);
    } catch (err: unknown) {
      console.error('[QuizScreen] submitAnswer error:', err);
      // 세션이 종료/재시작된 뒤 도착한 실패 응답은 현재 화면과 무관하므로 알림하지 않는다.
      if (sessionRunRef.current !== runToken) return;
      const message = err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('정답을 제출할 수 없어요', message);
    } finally {
      // 이전 세션의 응답이 현재 세션의 제출 상태를 건드리지 않도록 한다.
      if (sessionRunRef.current === runToken) setIsSubmitting(false);
    }
  };

  const settleQuiz = async (settleSessionId: string): Promise<void> => {
    const runToken = sessionRunRef.current;
    setIsSettling(true);
    try {
      const finishFn = isRetryMode ? finishRetrySession : finishQuizSession;
      const { data } = await finishFn(settleSessionId);

      if (sessionRunRef.current !== runToken) return;

      // 일반 퀴즈 세션이 완료된 경우에만 retry 대상 세션 ID를 갱신한다.
      // 다시풀기(retry) 세션 ID는 백엔드 retry 시작 API의 대상(일반 세션)이 될 수 없다.
      if (!isRetryMode) {
        setOriginalSessionId(settleSessionId);
      }
      setQuizResult(data);
      setIsFinished(true);
    } catch (err) {
      console.error('[QuizScreen] settleQuiz error:', err);
      // 응답을 기다리는 동안 세션이 초기화(나가기 등)됐다면 실패 화면을 띄우지 않는다.
      if (sessionRunRef.current !== runToken) return;
      setIsSettleFailed(true);
    } finally {
      isSettlingRef.current = false;
      if (sessionRunRef.current === runToken) setIsSettling(false);
    }
  };

  // 정산 실패 후 '다시 시도': 같은 세션으로 정산을 재요청한다. 문제 풀이 결과는 이미 서버에 제출되어
  // 있으므로 세션/문항 상태를 되돌릴 필요 없이 정산만 다시 시도하면 된다.
  const handleRetrySettle = (): void => {
    if (!sessionId) return;
    setIsSettleFailed(false);
    void settleQuiz(sessionId);
  };

  // 정산 실패 후 '나가기': 결과를 포기하고 시작 화면으로 돌아간다.
  const handleExitAfterSettleFail = (): void => {
    setIsSettleFailed(false);
    setIsPlaying(false);
    setIsFinished(false);
    setQuizResult(null);
    setSessionId(null);
    setQuizQuestions([]);
    setCurrentIndex(0);
    setIsCorrect(null);
    setExplanation('');
    setApiFinished(false);
    setIsRetryMode(false);
    sessionRunRef.current += 1;
  };

  const handleNext = (): void => {
    if (isSettlingRef.current) return;

    setIsCorrect(null);
    setExplanation('');

    if (apiFinished || currentIndex + 1 >= quizQuestions.length) {
      if (!sessionId) return;
      isSettlingRef.current = true;
      setIsPlaying(false);
      setIsSubmitting(false);
      sessionRunRef.current += 1;
      void settleQuiz(sessionId);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCloseFinalResult = (): void => {
    setIsFinished(false);
    setQuizResult(null);
    setIsRetryMode(false);
  };

  if (isSettling) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={COLORS.purple} />
      </View>
    );
  }

  if (isSettleFailed) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-10">
        <Text className="text-center font-notoSansKRBold text-lg text-black">
          결과를 정산하지 못했어요
        </Text>
        <Text className="mt-3 text-center font-notoSansKRRegular text-sm text-gray">
          네트워크 상태를 확인한 뒤 다시 시도해주세요.
        </Text>
        <View className="mt-8 w-full gap-3">
          <GradientButton
            label="다시 시도"
            onPress={handleRetrySettle}
            height={50}
            borderRadius={28}
          />
          <Pressable
            className="items-center justify-center rounded-full border border-gray py-3"
            onPress={handleExitAfterSettleFail}>
            <Text className="font-notoSansKRRegular text-sm text-black">나가기</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (isFinished && quizResult) {
    const wrongCount = quizResult.wrongCount ?? (quizResult.totalCount - quizResult.correctCount);
    // 틀린 문제가 있으면 다시풀기(retry), 전부 맞혔으면 결과 닫고 시작 화면으로 이동
    const retryHandler = wrongCount > 0 ? () => void handleRetryQuiz() : handleCloseFinalResult;

    return (
      <QuizFinalResultScreen
        result={quizResult}
        onRetry={retryHandler}
        onClose={handleCloseFinalResult}
      />
    );
  }

  if (isPlaying && quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentIndex];

    if (isCorrect === null) {
      return (
        <QuizQuestionScreen
          currentIndex={currentIndex}
          total={quizQuestions.length}
          question={currentQuestion}
          onAnswer={handleAnswer}
          onClose={handleCloseQuiz}
          isExitConfirmOpen={isExitConfirmOpen}
          onCancelExit={handleCancelExit}
          onConfirmExit={handleConfirmExit}
        />
      );
    }

    return (
      <QuizResultScreen
        currentIndex={currentIndex}
        total={quizQuestions.length}
        isCorrect={isCorrect}
        explanation={explanation}
        onNext={handleNext}
        onClose={handleCloseQuiz}
        isExitConfirmOpen={isExitConfirmOpen}
        onCancelExit={handleCancelExit}
        onConfirmExit={handleConfirmExit}
      />
    );
  }

  return (
    <QuizStartScreen
      quizCount={quizCount}
      onSelectCount={setQuizCount}
      onSolveQuiz={handleSolveQuiz}
      isLoading={isStarting}
    />
  );
};

export default QuizScreen;
