import React, { useState } from 'react';
import { Alert } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { RootTabParamList } from '@/navigation/types';
import QuizFinalResultScreen from '@/screens/quiz/QuizFinalResultScreen';
import QuizQuestionScreen, { QUESTION_POOL, QuizQuestion } from '@/screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import QuizStartScreen from '@/screens/quiz/QuizStartScreen';
import { startQuizSession } from '@/services/quiz.service';

const MOCK_LEVEL = 5;
const MOCK_CURRENT_XP = 500;

type Props = BottomTabScreenProps<RootTabParamList, 'Quiz'>;

const QuizScreen = ({ route }: Props) => {
  const [quizCount, setQuizCount] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
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
      setCorrectCount(0);
      setIsCorrect(null);
      setIsFinished(false);
      setIsPlaying(true);
    } catch (err: any) {
      // instance.ts 인터셉터가 message만 실어서 Error로 던지므로 code(QUIZ_NOT_FOUND 등)로는 분기 불가. message로 처리.
      Alert.alert('퀴즈를 시작할 수 없어요', err?.message ?? '잠시 후 다시 시도해주세요.');
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

  const handleAnswer = (selected: boolean): void => {
    const currentQuestion = quizQuestions[currentIndex];
    const correct = selected === currentQuestion.answer;
    if (correct) setCorrectCount((prev) => prev + 1);
    setIsCorrect(correct);
  };

  const handleNext = (): void => {
    setIsCorrect(null);
    if (currentIndex + 1 >= quizQuestions.length) {
      setIsPlaying(false);
      setIsFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCloseFinalResult = (): void => {
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <QuizFinalResultScreen
        correctCount={correctCount}
        totalCount={quizQuestions.length}
        level={MOCK_LEVEL}
        currentXp={MOCK_CURRENT_XP}
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
        explanation={currentQuestion.explanation}
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
