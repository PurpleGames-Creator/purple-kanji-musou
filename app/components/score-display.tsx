'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type ScoreDisplayProps = {
  value: number;
  label: string;
  delay?: number;
  suffix?: string;
};

export function ScoreDisplay({
  value,
  label,
  delay = 0,
  suffix = '',
}: ScoreDisplayProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const steps = 30;
      const increment = value / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 20);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <motion.p
        key={displayValue}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400"
      >
        {displayValue}
        {suffix}
      </motion.p>
    </motion.div>
  );
}
