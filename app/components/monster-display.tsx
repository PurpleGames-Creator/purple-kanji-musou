'use client';

import { motion } from 'framer-motion';
import { getMonsterStage } from '@/lib/quiz-logic';

type MonsterDisplayProps = {
  questionNumber: number;
};

export function MonsterDisplay({ questionNumber }: MonsterDisplayProps) {
  const stage = getMonsterStage(questionNumber);

  // ステージ別のスタイル設定
  const stageConfig = {
    1: {
      scale: 0.8,
      color: 'text-purple-400',
      glow: 'shadow-lg',
      label: '幼い魔物',
    },
    2: {
      scale: 1.0,
      color: 'text-purple-600',
      glow: 'shadow-purple-glow',
      label: '魔物',
    },
    3: {
      scale: 1.2,
      color: 'text-purple-800',
      glow: 'shadow-lg',
      label: '強力な魔物',
    },
    4: {
      scale: 1.3,
      color: 'text-red-600',
      glow: 'shadow-lg',
      label: '究極の魔物',
    },
  };

  const config = stageConfig[stage as keyof typeof stageConfig];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* モンスター本体（プレースホルダー） */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: 1,
          scale: stage === 4 ? [config.scale, config.scale * 1.1, config.scale] : config.scale,
          rotate: stage === 4 ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: stage === 4 ? 1 : 0.5,
          repeat: stage === 4 ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className={`flex items-center justify-center w-32 h-32 rounded-full ${
          stage === 4
            ? 'bg-gradient-to-br from-red-400 to-red-600'
            : stage === 3
              ? 'bg-gradient-to-br from-purple-500 to-purple-700'
              : stage === 2
                ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                : 'bg-gradient-to-br from-purple-300 to-purple-400'
        } ${config.glow} ${config.color}`}
      >
        <div className="text-5xl">👹</div>
      </motion.div>

      {/* ステージラベル */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-center font-bold ${config.color}`}
      >
        <p className="text-sm">問題 {questionNumber}/15</p>
        <p className="text-lg">{config.label}</p>
      </motion.div>

      {/* エフェクト（ステージ4の時のみ） */}
      {stage === 4 && (
        <>
          <motion.div
            className="absolute w-40 h-40 border-2 border-red-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-32 h-32 border-2 border-red-500 rounded-full"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
    </div>
  );
}
