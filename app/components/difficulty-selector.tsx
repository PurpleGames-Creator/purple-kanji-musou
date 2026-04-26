'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllDifficultyKeys, getDifficultyLabel } from '@/lib/kanji-difficulty';
import type { DifficultyLevel } from '@/lib/kanji-difficulty';
import Link from 'next/link';
import { AnimatedBackground } from './animated-background';

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
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 relative"
      style={{
        backgroundImage: 'url(/title-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      <div className="relative z-10 w-full flex flex-col items-center justify-start min-h-screen">
        {/* スペーサー - コンテンツを上に配置 */}
        <div className="flex-[4]"></div>

        {/* ニックネーム入力 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-sm mb-4"
        >
          <label className="block text-sm font-semibold text-white mb-2 drop-shadow-lg">
            ニックネーム
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 30))}
            placeholder="例：むらさき太郎"
            maxLength={30}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition text-white font-bold placeholder-gray-300"
          />
          <p className="text-xs text-white drop-shadow-lg mt-1">{nickname.length} / 30</p>
        </motion.div>

        {/* 難易度選択 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-2xl mb-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {difficulties.map((difficulty, index) => {
              const isUnlocked = isDifficultyUnlocked(difficulty);
              const isLastDifficulty = index === difficulties.length - 1;

              return (
                <motion.div
                  key={difficulty}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className={`relative ${isLastDifficulty ? 'col-span-2 sm:col-span-1 flex justify-center sm:justify-auto' : ''}`}
                >
                  <motion.button
                    whileHover={isUnlocked ? { scale: 1.05 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                    onClick={() => isUnlocked && setSelectedDifficulty(difficulty)}
                    disabled={!isUnlocked}
                    className={`w-full sm:w-auto py-4 px-4 rounded-lg font-bold text-lg sm:text-xl transition-all ${
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
                      <span className="text-lg">🔒</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* スタートボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mb-10"
        >
          {isReadyToStart ? (
            <Link
              href={`/quiz/${selectedDifficulty}?nickname=${encodeURIComponent(nickname)}`}
              className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-lg"
            >
              🎮 ゲームスタート！
            </Link>
          ) : (
            <button
              disabled
              className="inline-block px-10 py-4 bg-gray-400 text-gray-200 font-bold text-lg rounded-lg cursor-not-allowed opacity-70"
            >
              ゲームスタート！
            </button>
          )}
        </motion.div>

        {/* スペーサー - フッター用 */}
        <div className="flex-[2]"></div>
      </div>
    </div>
  );
}
