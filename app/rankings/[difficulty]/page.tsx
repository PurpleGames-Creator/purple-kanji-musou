'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { getDifficultyLabel } from '@/lib/kanji-difficulty';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type RankingEntry = {
  id: string;
  nickname: string;
  questions_correct: number;
  questions_total: number;
  clear_time_seconds: number;
  created_at: string;
  rank: number;
  accuracy: number;
};

function RankingsContent() {
  const params = useParams();
  const difficulty = (params.difficulty as string) || '';

  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'alltime'>('alltime');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/rankings/${encodeURIComponent(difficulty)}?period=${period}`
        );
        if (!res.ok) throw new Error('Failed to fetch rankings');
        const data = await res.json();
        setRankings(data.rankings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (difficulty) {
      fetchRankings();
    }
  }, [difficulty, period]);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🔹';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-red-600';
    if (accuracy >= 80) return 'text-orange-600';
    if (accuracy >= 70) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <h1 className="text-4xl font-bold text-purple-900 mb-2 text-center">
          ランキング
        </h1>
        <p className="text-lg text-purple-700 text-center">
          {getDifficultyLabel(difficulty as any)}
        </p>
      </motion.div>

      {/* Period tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl mx-auto mb-8 flex gap-3 justify-center flex-wrap"
      >
        {(['today', 'week', 'alltime'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              period === p
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
            }`}
          >
            {p === 'today' && '今日'}
            {p === 'week' && '今週'}
            {p === 'alltime' && '通算'}
          </button>
        ))}
      </motion.div>

      {/* Ranking table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
            />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 font-semibold">
            {error}
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            ランキングデータがまだありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">順位</th>
                  <th className="px-4 py-3 text-left">プレイヤー</th>
                  <th className="px-4 py-3 text-center">正解数</th>
                  <th className="px-4 py-3 text-center">正答率</th>
                  <th className="px-4 py-3 text-center">クリア時間</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-purple-50 transition"
                  >
                    <td className="px-4 py-3 font-bold text-lg">
                      <span className="mr-2">{getMedalEmoji(entry.rank)}</span>
                      {entry.rank}
                    </td>
                    <td className="px-4 py-3 font-semibold text-purple-900">
                      {entry.nickname}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-purple-600">
                      {entry.questions_correct} / {entry.questions_total}
                    </td>
                    <td
                      className={`px-4 py-3 text-center font-bold ${getAccuracyColor(
                        entry.accuracy
                      )}`}
                    >
                      {entry.accuracy}%
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {entry.clear_time_seconds.toFixed(1)}秒
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto mt-8 text-center"
      >
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-lg"
        >
          ホームに戻る
        </Link>
      </motion.div>
    </div>
  );
}

export default function RankingsPage() {
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
      <RankingsContent />
    </Suspense>
  );
}
