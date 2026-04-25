'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getDifficultyLabel } from '@/lib/kanji-difficulty';
import Link from 'next/link';

type DifficultyStats = {
  difficulty: string;
  attempts: number;
  totalCorrect: number;
  bestTime?: number;
  averageTime?: number;
  accuracy: number;
};

type ProfileData = {
  nickname: string;
  stats: DifficultyStats[];
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const nickname = searchParams.get('nickname') || '';

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nickname) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/profile/${encodeURIComponent(nickname)}`
        );
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [nickname]);

  if (!nickname) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">プロフィールが見つかりません</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

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
          {profile?.nickname}さんの成績
        </h1>
        <p className="text-lg text-purple-700 text-center">
          総合成績ダッシュボード
        </p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full"
          />
        </div>
      ) : error ? (
        <div className="max-w-4xl mx-auto text-center py-16 text-red-600 font-semibold">
          {error}
        </div>
      ) : !profile || profile.totalAttempts === 0 ? (
        <div className="max-w-4xl mx-auto text-center py-16 text-gray-600">
          <p className="mb-4">まだゲームをプレイしていません</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            ゲームを開始
          </Link>
        </div>
      ) : (
        <>
          {/* Overall stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg shadow-lg p-6">
              <p className="text-sm opacity-90 mb-1">総プレイ回数</p>
              <p className="text-4xl font-bold">{profile.totalAttempts}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
              <p className="text-sm opacity-90 mb-1">総正解数</p>
              <p className="text-4xl font-bold">{profile.totalCorrect}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 text-white rounded-lg shadow-lg p-6">
              <p className="text-sm opacity-90 mb-1">総合正答率</p>
              <p className="text-4xl font-bold">{profile.overallAccuracy}%</p>
            </div>
          </motion.div>

          {/* Per-difficulty stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              難易度別成績
            </h2>
            <div className="space-y-4">
              {profile.stats.length === 0 ? (
                <p className="text-gray-600">難易度別データがありません</p>
              ) : (
                profile.stats.map((stat, index) => (
                  <motion.div
                    key={stat.difficulty}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-purple-900">
                        {getDifficultyLabel(stat.difficulty as any)}
                      </h3>
                      <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        {stat.attempts}回
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">正解数</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {stat.totalCorrect}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">正答率</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {stat.accuracy}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          ベスト時間
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          {stat.bestTime
                            ? stat.bestTime.toFixed(1)
                            : '-'}秒
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">平均時間</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {stat.averageTime
                            ? stat.averageTime.toFixed(1)
                            : '-'}秒
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/rankings/${encodeURIComponent(stat.difficulty)}`}
                      className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-semibold inline-block"
                    >
                      ランキングを見る →
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
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
        </>
      )}
    </div>
  );
}

export default function ProfilePage() {
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
      <ProfileContent />
    </Suspense>
  );
}
