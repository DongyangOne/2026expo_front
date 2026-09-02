import React, { useRef, useState } from 'react';
import { Alert } from 'react-native';

import QuizFinalResultScreen from '@/screens/quiz/QuizFinalResultScreen';
import QuizQuestionScreen, { QUESTION_POOL, QuizQuestion } from '@/screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import QuizStartScreen from '@/screens/quiz/QuizStartScreen';
import { startQuizSession, submitQuizAnswer } from '@/services/quiz.service';

const MOCK_LEVEL = 5;
const MOCK_CURRENT_XP = 500;

const QuizScreen = () => {
  const [quizCount, setQuizCount] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState('');
  const [apiFinished, setApiFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 세션 실행 토큰: 새 퀴즈 시작/종료 시 갱신해 이전 요청의 응답을 무효화한다.
  const sessionRunRef = useRef(0);

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
      setCorrectCount(0);
      setIsCorrect(null);
      setExplanation('');
      setApiFinished(false);
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

      if (data.isCorrect) setCorrectCount((prev) => prev + 1);
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
      const message = err instanceof Error ? err.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('정답을 제출할 수 없어요', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = (): void => {
    setIsCorrect(null);
    setExplanation('');

    if (apiFinished || currentIndex + 1 >= quizQuestions.length) {
      setIsPlaying(false);
      setIsFinished(true);
      sessionRunRef.current += 1;
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
