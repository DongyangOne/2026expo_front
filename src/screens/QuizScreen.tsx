import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { RootTabParamList } from '@/navigation/types';
import QuizFinalResultScreen from '@/screens/quiz/QuizFinalResultScreen';
import QuizQuestionScreen, { QUESTION_POOL, QuizQuestion } from '@/screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import QuizStartScreen from '@/screens/quiz/QuizStartScreen';
import { finishQuizSession, startQuizSession, submitQuizAnswer } from '@/services/quiz.service';
import type { QuizResultData } from '@/types';

type Props = BottomTabScreenProps<RootTabParamList, 'Quiz'>;

const QuizScreen = ({ route }: Props) => {
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
  const wrongQuizInfo = route.params?.wrongQuizInfo;

  const handleSolveQuiz = async (): Promise<void> => {
    if (!quizCount || isStarting) return;

    setIsStarting(true);
    try {
      const { data } = await startQuizSession({
        quantity: quizCount,
        ...(wrongQuizInfo ? { wrongQuizInfo } : {}),
      });

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
      setIsFinished(false);
      setIsPlaying(true);
    } catch (err: unknown) {
      // instance.ts 인터셉터가 message만 실어서 Error로 던지므로 code(QUIZ_NOT_FOUND 등)로는 분기 불가. message로 처리.
      Alert.alert(
        '퀴즈를 시작할 수 없어요',
        err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.',
      );
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
  };

  const handleAnswer = async (selected: boolean): Promise<void> => {
    if (!sessionId || isSubmitting) return;

    const currentQuestion = quizQuestions[currentIndex];
    setIsSubmitting(true);

    try {
      const { data } = await submitQuizAnswer(sessionId, {
        currentQuizId: currentQuestion.id,
        answer: selected ? 'O' : 'X',
      });

      setExplanation(data.explan);
      setApiFinished(data.finished);

      if (!data.finished) {
        const nextIndex = currentIndex + 1;
        setQuizQuestions((previous) => {
          if (nextIndex >= previous.length) return previous;
          const nextQuestions = [...previous];
          nextQuestions[nextIndex] = {
            ...nextQuestions[nextIndex],
            id: data.nextQuizId,
            question: data.nextQuestion,
          };
          return nextQuestions;
        });
      }

      setIsCorrect(data.isCorrect);
    } catch (error: unknown) {
      Alert.alert(
        '정답을 제출할 수 없어요',
        error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (): void => {
    setIsCorrect(null);
    setExplanation('');
    if (apiFinished || currentIndex + 1 >= quizQuestions.length) {
      if (!sessionId || isSettling) return;
      setIsSettling(true);
      void finishQuizSession(sessionId)
        .then(({ data }) => {
          setQuizResult(data);
          setIsPlaying(false);
          setIsFinished(true);
        })
        .catch((error: unknown) => {
          Alert.alert(
            '퀴즈 결과를 불러올 수 없어요',
            error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.',
          );
        })
        .finally(() => setIsSettling(false));
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCloseFinalResult = (): void => {
    setIsFinished(false);
    setQuizResult(null);
  };

  if (isSettling) {
    return <View className="flex-1 items-center justify-center bg-background" />;
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
        explanation={explanation || currentQuestion.explanation}
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
