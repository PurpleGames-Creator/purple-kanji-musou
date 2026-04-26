'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { QuizQuestion } from '@/app/components/quiz-question';
import { QuizTimer } from '@/app/components/quiz-timer';

type QuizQuestion = {
  id: string;
  difficulty: string;
  sentence: string;
  fullSentence: string;
  kanji: string;
  reading: string;
  correctAnswers: string[];
  explanation: string;
  type: string;
};

function QuizContent({
  difficulty,
  nickname,
}: {
  difficulty: string;
  nickname: string;
}) {
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [life, setLife] = useState(2);
  const [skipCount, setSkipCount] = useState(0);
  const maxSkips = 2;

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `/api/quiz/questions/${encodeURIComponent(difficulty)}`
        );
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unknown error occurred'
        );
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [difficulty]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-bold mb-4">
            {error || 'Failed to load questions'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Safety check: ensure currentQuestion exists and has required fields
  if (!currentQuestion || !currentQuestion.sentence) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 font-bold mb-4">
            データ読み込みエラー: 問題のsentenceフィールドが見つかりません
          </p>
          <p className="text-gray-600 mb-4">
            {!currentQuestion ? '質問が未定義' : `現在の質問: ${JSON.stringify(currentQuestion)}`}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = async (answer: string) => {
    setIsAnswered(true);

    let correct = false;

    // Validate answer
    try {
      const res = await fetch('/api/quiz/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: answer,
          correctAnswers: currentQuestion.correctAnswers,
        }),
      });

      const data = await res.json();
      if (data.isCorrect) {
        setCorrectCount((prev) => prev + 1);
        correct = true;
        setIsCorrect(true);
      } else {
        // 間違い時はライフ -1
        const newLife = life - 1;
        setLife(newLife);
        setIsCorrect(false);

        // ライフが0になったらゲームオーバー
        if (newLife <= 0) {
          setTimeout(() => {
            const clearTimeSeconds = (Date.now() - startTime) / 1000;
            router.push(
              `/quiz/gameover?` +
                `difficulty=${encodeURIComponent(difficulty)}&` +
                `nickname=${encodeURIComponent(nickname)}&` +
                `correct=${correctCount}&` +
                `incorrect=${currentQuestionIndex - correctCount + 1}&` +
                `questionNumber=${currentQuestionIndex + 1}&` +
                `time=${clearTimeSeconds.toFixed(1)}`
            );
          }, 2000);
          return;
        }
      }
    } catch (err) {
      console.error('Validation error:', err);
    }

    // Auto-advance to next question after 2 seconds (wait for feedback animation)
    setTimeout(() => {
      if (isLastQuestion && correct) {
        const clearTimeSeconds = (Date.now() - startTime) / 1000;
        router.push(
          `/quiz/result?` +
            `difficulty=${encodeURIComponent(difficulty)}&` +
            `nickname=${encodeURIComponent(nickname)}&` +
            `correct=${correctCount + 1}&` +
            `total=15&` +
            `time=${clearTimeSeconds.toFixed(1)}`
        );
      } else if (!isLastQuestion || correct) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswered(false);
        setIsCorrect(false);
      }
    }, 2000);
  };

  const handleSkip = () => {
    if (skipCount >= maxSkips) return;
    setSkipCount((prev) => prev + 1);
    setIsAnswered(true);
    setIsCorrect(false);
    setTimeout(() => {
      if (isLastQuestion) {
        const clearTimeSeconds = (Date.now() - startTime) / 1000;
        router.push(
          `/quiz/result?` +
            `difficulty=${encodeURIComponent(difficulty)}&` +
            `nickname=${encodeURIComponent(nickname)}&` +
            `correct=${correctCount}&` +
            `total=15&` +
            `time=${clearTimeSeconds.toFixed(1)}`
        );
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswered(false);
        setIsCorrect(false);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    setIsAnswered(true);
    setIsCorrect(false);
    const newLife = life - 1;
    setLife(newLife);

    if (newLife <= 0) {
      setTimeout(() => {
        const clearTimeSeconds = (Date.now() - startTime) / 1000;
        router.push(
          `/quiz/gameover?` +
            `difficulty=${encodeURIComponent(difficulty)}&` +
            `nickname=${encodeURIComponent(nickname)}&` +
            `correct=${correctCount}&` +
            `incorrect=${currentQuestionIndex - correctCount + 1}&` +
            `questionNumber=${currentQuestionIndex + 1}&` +
            `time=${clearTimeSeconds.toFixed(1)}`
        );
      }, 2000);
      return;
    }

    setTimeout(() => {
      if (isLastQuestion) {
        const clearTimeSeconds = (Date.now() - startTime) / 1000;
        router.push(
          `/quiz/result?` +
            `difficulty=${encodeURIComponent(difficulty)}&` +
            `nickname=${encodeURIComponent(nickname)}&` +
            `correct=${correctCount}&` +
            `total=15&` +
            `time=${clearTimeSeconds.toFixed(1)}`
        );
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnswered(false);
        setIsCorrect(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-4">
      {/* Upper half - All game content (50vh) */}
      <div className="h-1/2 flex flex-col gap-2 overflow-hidden">
        {/* Header */}
        <div className="w-full flex justify-between items-center flex-shrink-0">
          <div className="text-xs font-black text-purple-900">
            {nickname}
          </div>
          <div className="text-sm">
            {life === 2 && '❤️❤️'}
            {life === 1 && '❤️'}
            {life === 0 && '💔'}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full flex-shrink-0">
          <div className="w-full bg-purple-200 rounded-full h-1 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-purple-700 h-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestionIndex + 1) / 15) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main game area - compact layout */}
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
          {/* Quiz area - centered */}
          <div className="flex flex-col items-center gap-2 overflow-hidden">
            {/* Timer */}
            {!isAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <QuizTimer initialSeconds={15} onTimeUp={handleTimeUp} />
              </motion.div>
            )}

            {/* Question and input - keep original size */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
              <QuizQuestion
                sentence={currentQuestion.sentence}
                fullSentence={currentQuestion.fullSentence}
                kanji={currentQuestion.kanji}
                reading={currentQuestion.reading}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
                isAnswered={isAnswered}
                isCorrect={isCorrect}
                skipCount={skipCount}
                maxSkips={maxSkips}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lower half - Keyboard area (50vh) - reserved for mobile keyboard */}
      <div className="h-1/2"></div>

      {/* Explanation modal - floating popup */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white rounded-lg p-6 max-w-xs mx-4 text-center shadow-2xl"
          >
            <p className="text-sm text-gray-700 font-semibold mb-4">
              {currentQuestion.explanation}
            </p>
            <p className="text-xs text-gray-500">2秒後に次の問題へ...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ difficulty: string }>;
}) {
  const [difficulty, setDifficulty] = useState<string>('');
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname') || 'Player';

  useEffect(() => {
    params.then((p) => setDifficulty(p.difficulty));
  }, [params]);

  if (!difficulty) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
          />
        </div>
      }
    >
      <QuizContent difficulty={difficulty} nickname={nickname} />
    </Suspense>
  );
}
