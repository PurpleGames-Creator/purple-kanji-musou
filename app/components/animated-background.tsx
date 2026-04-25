'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  // パーティクル数
  const particles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* ベースグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-white" />

      {/* グロー効果レイヤー */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-purple-400 to-transparent rounded-full blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-purple-300 to-transparent rounded-full blur-3xl"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* 和柄パターンレイヤー */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="asanoha"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* 麻の葉パターン */}
            <g stroke="currentColor" strokeWidth="1" fill="none">
              {/* 中央の六角形 */}
              <polygon points="40,10 60,20 60,40 40,50 20,40 20,20" />
              {/* 放射状の線 */}
              <line x1="40" y1="10" x2="40" y2="0" />
              <line x1="60" y1="20" x2="68" y2="12" />
              <line x1="60" y1="40" x2="70" y2="40" />
              <line x1="40" y1="50" x2="40" y2="60" />
              <line x1="20" y1="40" x2="10" y2="40" />
              <line x1="20" y1="20" x2="12" y2="12" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asanoha)" />
      </svg>

      {/* フローティングパーティクル */}
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-400 to-purple-600 blur-sm"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* 追加のグロー粒子 */}
      {Array.from({ length: 8 }, (_, i) => i).map((i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute rounded-full bg-purple-300"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}
