'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function GameOverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const correct = parseInt(searchParams.get('correct') || '0');
  const incorrect = parseInt(searchParams.get('incorrect') || '0');
  const questionNumber = parseInt(searchParams.get('questionNumber') || '0');
  const time = searchParams.get('time') || '0';
  const difficulty = searchParams.get('difficulty') || 'normal';
  const nickname = searchParams.get('nickname') || 'Player';

  const accuracy = Math.round(((correct) / (correct + incorrect)) * 100) || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-4 py-8">
      {/* Game Over Title */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-black text-red-600 mb-4">ゲームオーバー</h1>
        <p className="text-2xl font-black text-red-500">ライフが0になりました</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mb-8"
      >
        <div className="space-y-6">
          <div className="border-b-2 border-purple-200 pb-4">
            <p className="text-sm text-gray-600 mb-2">正解数</p>
            <p className="text-4xl font-black text-purple-600">{correct}問</p>
          </div>

          <div className="border-b-2 border-purple-200 pb-4">
            <p className="text-sm text-gray-600 mb-2">不正解数</p>
            <p className="text-4xl font-black text-red-600">{incorrect}問</p>
          </div>

          <div className="border-b-2 border-purple-200 pb-4">
            <p className="text-sm text-gray-600 mb-2">正答率</p>
            <p className="text-4xl font-black text-purple-600">{accuracy}%</p>
          </div>

          <div className="border-b-2 border-purple-200 pb-4">
            <p className="text-sm text-gray-600 mb-2">失敗した問題番号</p>
            <p className="text-4xl font-black text-orange-600">{questionNumber}問目</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">クリア時間</p>
            <p className="text-3xl font-black text-purple-600">{parseFloat(time).toFixed(1)}秒</p>
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="flex-1 py-4 bg-purple-600 text-white font-black rounded-lg hover:bg-purple-700 transition text-lg"
        >
          ホームに戻る
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            router.push(
              `/quiz/${difficulty}?nickname=${encodeURIComponent(nickname)}`
            )
          }
          className="flex-1 py-4 bg-orange-500 text-white font-black rounded-lg hover:bg-orange-600 transition text-lg"
        >
          リトライ
        </motion.button>
      </div>
    </div>
  );
}
