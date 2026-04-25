'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllDifficultyKeys, getDifficultyLabel } from '@/lib/kanji-difficulty';
import type { DifficultyLevel } from '@/lib/kanji-difficulty';
import Link from 'next/link';

export function DifficultySelector() {
  const [nickname, setNickname] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<Set<DifficultyLevel>>(
    new Set(['easy', 'normal'])
  );

  const difficulties = getAllDifficultyKeys();

  const isReadyToStart = nickname.trim().length > 0 && selectedDifficulty;

  // Load unlocked difficulties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unlockedDifficulties');
    if (saved) {
      try {
        setUnlockedDifficulties(new Set(JSON.parse(saved)));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Check if difficulty is unlocked
  const isDifficultyUnlocked = (difficulty: DifficultyLevel) => {
    return unlockedDifficulties.has(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white px-4">
      {/* タイトル */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold text-purple-900 mb-2 text-center"
      >
        Purple漢字無双
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-purple-700 mb-10 text-center"
      >
        漢字の読みをテキスト入力で答えよう！
      </motion.p>

      {/* ニックネーム入力 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-sm mb-8"
      >
        <label className="block text-sm font-semibold text-purple-900 mb-2">
          ニックネーム
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 30))}
          placeholder="半角・全角20字まで"
          maxLength={30}
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition text-black placeholder-gray-500"
        />
        <p className="text-xs text-purple-600 mt-1">{nickname.length} / 30</p>
      </motion.div>

      {/* 難易度選択 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-lg"
      >
        <label className="block text-sm font-semibold text-purple-900 mb-4">
          難易度を選択
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {difficulties.map((difficulty, index) => {
            const isUnlocked = isDifficultyUnlocked(difficulty);
            return (
              <motion.div
                key={difficulty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="relative"
              >
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.05 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  onClick={() => isUnlocked && setSelectedDifficulty(difficulty)}
                  disabled={!isUnlocked}
                  className={`w-full py-4 px-3 rounded-lg font-bold text-lg transition-all ${
                    !isUnlocked
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                      : selectedDifficulty === difficulty
                        ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300'
                        : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                  }`}
                >
                  {getDifficultyLabel(difficulty as DifficultyLevel)}
                </motion.button>
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* スタートボタン - 常に表示、ニックネーム入力で有効化 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-10"
      >
        {isReadyToStart ? (
          <Link
            href={`/quiz/${selectedDifficulty}?nickname=${encodeURIComponent(nickname)}`}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-lg"
          >
            ゲームスタート！
          </Link>
        ) : (
          <button
            disabled
            className="inline-block px-8 py-4 bg-gray-400 text-gray-200 font-bold text-lg rounded-lg cursor-not-allowed opacity-70"
          >
            ゲームスタート！
          </button>
        )}
      </motion.div>
    </div>
  );
}
