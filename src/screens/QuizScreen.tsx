import React, { useState } from 'react';

import QuizFinalResultScreen from '@/screens/quiz/QuizFinalResultScreen';
import QuizQuestionScreen, { QUESTION_POOL, QuizQuestion } from '@/screens/quiz/QuizQuestionScreen';
import QuizResultScreen from '@/screens/quiz/QuizResultScreen';
import QuizStartScreen from '@/screens/quiz/QuizStartScreen';

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
  const [correctCount, setCorrectCount] = useState(0);

  const handleSolveQuiz = (): void => {
    if (!quizCount) return;
    setQuizQuestions(QUESTION_POOL.slice(0, quizCount));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsCorrect(null);
    setIsFinished(false);
    setIsPlaying(true);
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
    />
  );
};

export default QuizScreen;
