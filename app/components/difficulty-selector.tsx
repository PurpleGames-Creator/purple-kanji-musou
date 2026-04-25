'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getAllDifficultyKeys, getDifficultyLabel } from '@/lib/kanji-difficulty';
import type { DifficultyLevel } from '@/lib/kanji-difficulty';
import Link from 'next/link';

export function DifficultySelector() {
  const [nickname, setNickname] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const difficulties = getAllDifficultyKeys();

  const isReadyToStart = nickname.trim().length > 0 && selectedDifficulty;

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
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition"
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
          {difficulties.map((difficulty, index) => (
            <motion.button
              key={difficulty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`py-4 px-3 rounded-lg font-bold text-lg transition-all ${
                selectedDifficulty === difficulty
                  ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-300'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
              }`}
            >
              {getDifficultyLabel(difficulty as DifficultyLevel)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* スタートボタン */}
      {isReadyToStart && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <Link
            href={`/quiz/${selectedDifficulty}?nickname=${encodeURIComponent(nickname)}`}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-lg"
          >
            ゲームスタート！
          </Link>
        </motion.div>
      )}
    </div>
  );
}
