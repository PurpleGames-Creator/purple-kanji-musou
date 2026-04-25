'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type TimerProps = {
  initialSeconds: number;
  onTimeUp: () => void;
};

export function QuizTimer({ initialSeconds, onTimeUp }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setRemainingSeconds(remainingSeconds - 0.1);
    }, 100);

    return () => clearTimeout(timer);
  }, [remainingSeconds, onTimeUp]);

  const displaySeconds = Math.ceil(remainingSeconds);
  const isWarning = displaySeconds <= 5;

  return (
    <motion.div
      className={`flex items-center justify-center w-24 h-24 rounded-full font-black text-4xl transition-colors ${
        isWarning
          ? 'bg-red-100 text-red-600'
          : 'bg-purple-100 text-purple-600'
      }`}
      animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
      transition={isWarning ? { repeat: Infinity, duration: 0.6 } : {}}
    >
      {displaySeconds}
      <span className="text-lg ml-1">秒</span>
    </motion.div>
  );
}
