'use client';

import { motion } from 'framer-motion';

interface FeedbackAnimationProps {
  isCorrect: boolean;
  isVisible: boolean;
}

export function FeedbackAnimation({ isCorrect, isVisible }: FeedbackAnimationProps) {
  if (!isVisible) return null;

  const symbol = isCorrect ? '〇' : '✕';
  const color = 'text-purple-600';

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className={`text-9xl font-black ${color}`}
      >
        {symbol}
      </motion.div>
    </motion.div>
  );
}
