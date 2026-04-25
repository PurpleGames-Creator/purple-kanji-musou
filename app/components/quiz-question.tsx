'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type QuizQuestionProps = {
  kanji: string;
  questionText: string;
  onAnswer: (answer: string) => void;
  onSkip?: () => void;
  isAnswered: boolean;
};

export function QuizQuestion({
  kanji,
  questionText,
  onAnswer,
  onSkip,
  isAnswered,
}: QuizQuestionProps) {
  const [input, setInput] = useState('');

  useEffect(() => {
    // 次の問題に移るとき、入力をリセット
    setInput('');
  }, [kanji]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full max-w-md"
    >
      {/* 漢字 */}
      <motion.div
        key={kanji}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="text-7xl sm:text-8xl font-black text-purple-700 text-stroke-1.5"
      >
        {kanji}
      </motion.div>

      {/* 問題文 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-purple-900 text-center font-semibold"
      >
        {questionText}
      </motion.p>

      {/* 入力フォーム */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ひらがなで答える"
          disabled={isAnswered}
          autoFocus
          className="w-full px-4 py-3 text-lg border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition"
        />

        {/* ボタン */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isAnswered || !input.trim()}
            className="flex-1 py-3 bg-purple-600 text-white font-black rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            答える
          </motion.button>

          {onSkip && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onSkip}
              disabled={isAnswered}
              className="flex-1 py-3 bg-gray-400 text-white font-black rounded-lg hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              スキップ
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
