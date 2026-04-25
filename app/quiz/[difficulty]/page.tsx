'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { QuizQuestion } from '@/app/components/quiz-question';
import { QuizTimer } from '@/app/components/quiz-timer';
import { MonsterDisplay } from '@/app/components/monster-display';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="text-sm font-black text-purple-900">
          {nickname}
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-sm font-black text-purple-600">
            {currentQuestionIndex + 1} / 15
          </div>
          <div className="text-lg">
            {life === 2 && '❤️❤️'}
            {life === 1 && '❤️'}
            {life === 0 && '💔'}
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div className="w-full max-w-2xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Left: Monster display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col items-center"
        >
          <MonsterDisplay questionNumber={currentQuestionIndex + 1} />
        </motion.div>

        {/* Right: Quiz area */}
        <div className="flex-1 flex flex-col items-center gap-6">
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

          {/* Question and input */}
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

          {/* Explanation after answering */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-gray-600">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mt-12">
        <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
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
