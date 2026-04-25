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
    <div className="flex flex-col items-center gap-4 relative">
      {/* モンスター本体 */}
      <div className="relative">
        {/* 背景グロー（ステージ3以上） */}
        {stage >= 3 && (
          <>
            <motion.div
              className={`absolute inset-0 rounded-full blur-3xl ${
                stage === 4 ? 'bg-red-600' : 'bg-purple-600'
              }`}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </>
        )}

        {/* メインモンスター */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale:
              stage === 4
                ? [config.scale, config.scale * 1.15, config.scale]
                : config.scale,
            rotate: stage === 4 ? [0, 8, -8, 0] : 0,
          }}
          transition={{
            duration: stage === 4 ? 1.2 : 0.5,
            repeat: stage >= 2 ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className={`relative flex items-center justify-center w-32 h-32 rounded-full ${
            stage === 4
              ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-2xl'
              : stage === 3
                ? 'bg-gradient-to-br from-purple-600 to-purple-800 shadow-xl'
                : stage === 2
                  ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg'
                  : 'bg-gradient-to-br from-purple-400 to-purple-500 shadow-md'
          } ${config.color}`}
        >
          <motion.div
            animate={stage === 4 ? { scale: [1, 1.05, 1] } : {}}
            transition={{
              duration: 0.8,
              repeat: stage === 4 ? Infinity : 0,
            }}
            className="text-6xl"
          >
            👹
          </motion.div>
        </motion.div>
      </div>

      {/* リング エフェクト（ステージ4） */}
      {stage === 4 && (
        <>
          <motion.div
            className="absolute w-48 h-48 border-2 border-red-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-40 h-40 border-2 border-red-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}

      {/* ステージラベル */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-center font-black ${config.color}`}
      >
        <motion.p
          animate={{ scale: stage === 4 ? [1, 1.1, 1] : 1 }}
          transition={{
            duration: stage === 4 ? 1.2 : 0,
            repeat: stage === 4 ? Infinity : 0,
          }}
          className="text-sm"
        >
          問題 {questionNumber}/15
        </motion.p>
        <p className="text-lg font-black">{config.label}</p>
      </motion.div>
    </div>
  );
}
