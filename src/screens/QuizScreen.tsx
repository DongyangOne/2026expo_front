import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import QuizFinalResultScreen from '@/screens/quiz/QuizFinalResultScreen';
import QuizQuestionScreen, { QUESTION_POOL, QuizQuestion } from '@/screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import QuizStartScreen from '@/screens/quiz/QuizStartScreen';
import { finishQuizSession, startQuizSession, submitQuizAnswer } from '@/services/quiz.service';
import type { QuizResultData } from '@/types';

import tailwindConfig from '../../tailwind.config.js';

const { colors } = tailwindConfig.theme!.extend! as { colors: { purple: string } };

const QuizScreen = (): React.JSX.Element => {
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
  // 세션 실행 토큰: 새 퀴즈 시작/종료 시 갱신해 이전 요청의 응답을 무효화한다.
  const sessionRunRef = useRef(0);
  // "다음" 연타로 결과 정산 요청이 중복 전송되는 것을 막는 동기 락. state는 리렌더 전까지 갱신되지 않아 사용할 수 없다.
  const isSettlingRef = useRef(false);

  const handleSolveQuiz = async (): Promise<void> => {
    if (!quizCount || isStarting) return;

    setIsStarting(true);
    try {
      const { data } = await startQuizSession({ quantity: quizCount });

      sessionRunRef.current += 1;

      const questions = QUESTION_POOL.slice(0, quizCount);
      if (questions.length > 0) {
        questions[0] = { ...questions[0], id: data.quizId, question: data.question };
      }

      setSessionId(data.sessionId);
      setQuizQuestions(questions);
      setCurrentIndex(0);
      setIsCorrect(null);
      setExplanation('');
      setApiFinished(false);
      setQuizResult(null);
      setIsSubmitting(false);
      setIsSettling(false);
      setIsFinished(false);
      setIsPlaying(true);
    } catch (err: unknown) {
      // instance.ts 인터셉터가 message만 실어서 Error로 던지므로 code(QUIZ_NOT_FOUND 등)로는 분기 불가. message로 처리.
      const message = err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('퀴즈를 시작할 수 없어요', message);
    } finally {
      setIsStarting(false);
    }
  };

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
    sessionRunRef.current += 1;
  };

  const handleAnswer = async (selected: boolean): Promise<void> => {
    if (!sessionId || isSubmitting) return;

    const currentQuestion = quizQuestions[currentIndex];
    const runToken = sessionRunRef.current;

    setIsSubmitting(true);
    try {
      const { data } = await submitQuizAnswer(sessionId, {
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
      const { data } = await finishQuizSession(settleSessionId);

      if (sessionRunRef.current !== runToken) return;

      setQuizResult(data);
      setIsFinished(true);
    } catch (err: unknown) {
      if (sessionRunRef.current !== runToken) return;
      const message = err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('결과를 정산하지 못했어요', message);
    } finally {
      isSettlingRef.current = false;
      if (sessionRunRef.current === runToken) setIsSettling(false);
    }
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
  };

  if (isSettling) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  if (isFinished && quizResult) {
    return (
      <QuizFinalResultScreen
        result={quizResult}
        onRetry={handleSolveQuiz}
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
