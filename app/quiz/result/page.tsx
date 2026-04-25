'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getDifficultyLabel } from '@/lib/kanji-difficulty';
import { calculateAccuracy } from '@/lib/quiz-logic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const difficulty = searchParams.get('difficulty') || '';
  const nickname = searchParams.get('nickname') || 'Player';
  const correct = parseInt(searchParams.get('correct') || '0');
  const total = parseInt(searchParams.get('total') || '15');
  const time = parseFloat(searchParams.get('time') || '0');

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setError] = useState<string | null>(null);

  const accuracy = calculateAccuracy(correct, total);

  // Save score to database
  useEffect(() => {
    const saveScore = async () => {
      if (isSaving) return;
      setIsSaving(true);

      try {
        const response = await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname,
            difficulty,
            questionsCorrect: correct,
            questionsTotal: total,
            clearTimeSeconds: time,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save score');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to save score'
        );
      }
    };

    saveScore();
  }, []);

  // Score grade calculation
  const getGrade = (accuracy: number) => {
    if (accuracy >= 90) return { label: 'S', color: 'text-red-600' };
    if (accuracy >= 80) return { label: 'A', color: 'text-orange-600' };
    if (accuracy >= 70) return { label: 'B', color: 'text-yellow-600' };
    if (accuracy >= 60) return { label: 'C', color: 'text-green-600' };
    return { label: 'D', color: 'text-blue-600' };
  };

  const grade = getGrade(accuracy);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-8">
      {/* Celebration animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl font-bold text-purple-900 mb-2 text-center"
      >
        クリア！
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-lg text-purple-700 mb-10"
      >
        {nickname}さん、お疲れ様です！
      </motion.p>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mb-8"
      >
        {/* Difficulty */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-1">難易度</p>
          <p className="text-2xl font-bold text-purple-600">
            {getDifficultyLabel(difficulty as any)}
          </p>
        </div>

        {/* Grade */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className={`text-7xl font-bold ${grade.color}`}
          >
            {grade.label}
          </motion.div>
        </div>

        {/* Score details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">正解数</span>
            <span className="text-2xl font-bold text-purple-600">
              {correct} / {total}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">正答率</span>
            <span className="text-2xl font-bold text-purple-600">
              {accuracy.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">クリア時間</span>
            <span className="text-2xl font-bold text-purple-600">
              {time.toFixed(1)}秒
            </span>
          </div>
        </div>
      </motion.div>

      {/* Save status */}
      {saveError && (
        <motion.p className="text-red-600 text-sm mb-4">
          スコア保存に失敗しました: {saveError}
        </motion.p>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex gap-4 w-full max-w-md flex-col"
      >
        <Link
          href={`/rankings/${encodeURIComponent(difficulty)}`}
          className="py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg text-center"
        >
          ランキングを見る
        </Link>

        <Link
          href="/"
          className="py-3 px-6 bg-purple-100 text-purple-900 font-bold rounded-lg hover:bg-purple-200 transition-all text-center"
        >
          ホームに戻る
        </Link>
      </motion.div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-purple-600">読込み中...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
