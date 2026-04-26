'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FeedbackAnimation } from './feedback-animation';

type QuizQuestionProps = {
  sentence: string;          // 「椅子に____。」
  fullSentence: string;      // 「椅子に座る。」
  kanji: string;             // 「座る」
  reading: string;           // 「すわる」
  onAnswer: (answer: string) => void;
  onSkip?: () => void;
  isAnswered: boolean;
  isCorrect?: boolean;
  skipCount?: number;
  maxSkips?: number;
};

// Helper function to render fullSentence with the kanji part underlined
function renderFullSentenceWithUnderline(fullSentence: string, kanji: string) {
  // Find the kanji part in the full sentence and split it
  const parts = fullSentence.split(new RegExp(`(${kanji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`));

  return parts.map((part, index) => {
    // If this part matches the kanji, wrap it with underline styling
    if (part === kanji) {
      return (
        <span key={index} className="border-b-4 border-purple-400 font-bold">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function QuizQuestion({
  sentence,
  fullSentence,
  kanji,
  reading,
  onAnswer,
  onSkip,
  isAnswered,
  isCorrect,
  skipCount = 0,
  maxSkips = 2,
}: QuizQuestionProps) {
  const [input, setInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 次の問題に移るとき、入力とフィードバックをリセット
    setInput('');
    setShowFeedback(false);
    // Auto-focus input field for new question
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [sentence]);

  useEffect(() => {
    // 回答後、フィードバックを表示
    if (isAnswered) {
      setShowFeedback(true);
      const timer = setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnswered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnswer(input);
    }
  };

  // 文に__の部分にアンダーラインを追加
  const sentenceParts = sentence.split('____');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-8 w-full max-w-md"
    >
      {/* フィードバックアニメーション */}
      <FeedbackAnimation isCorrect={isCorrect ?? false} isVisible={showFeedback} />

      {/* 完全文を表示 - 答えるべき部分に下線を引く */}
      <motion.div
        key={sentence}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="text-center"
      >
        <p className="text-3xl sm:text-4xl font-black text-purple-900 leading-relaxed">
          {renderFullSentenceWithUnderline(fullSentence, kanji)}
        </p>
      </motion.div>

      {/* 回答後、正解を表示 */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-gray-600 mb-2">正解</p>
          <p className="text-2xl font-black text-purple-600">{reading}</p>
        </motion.div>
      )}

      {/* 入力フォーム */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ひらがなで答える"
          disabled={isAnswered}
          className="w-full px-4 py-3 text-lg border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition text-black placeholder-gray-600"
        />

        {/* ボタン */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isAnswered || !input.trim()}
            className="flex-1 py-3 bg-purple-600 text-white font-black rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-lg"
          >
            攻撃！
          </motion.button>

          {onSkip && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onSkip}
              disabled={isAnswered || skipCount >= maxSkips}
              className="flex-1 py-3 bg-gray-400 text-white font-black rounded-lg hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              <div className="flex flex-col items-center">
                <span>スキップ</span>
                <span className="text-sm">残り{maxSkips - skipCount}回</span>
              </div>
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
