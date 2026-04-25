/**
 * ユーザー入力が正解かどうかを判定
 * ひらがなで比較、複数の読み方に対応、複数形式対応
 */
export function validateAnswer(
  userInput: string,
  correctAnswers: string[] | string,
  answerType: 'full' | 'okuri' = 'full'
): boolean {
  const normalized = userInput.trim();

  // 複数の正解に対応
  const answerList = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];

  for (const correctAnswer of answerList) {
    // 各正解を処理
    const expected = correctAnswer.trim();

    if (answerType === 'okuri') {
      // 送り仮名の場合は末尾から数文字を抽出
      // 例：「読む」の場合「む」を期待値とする
      if (normalized === expected) {
        return true;
      }
      continue;
    }

    // 通常の判定（完全一致）
    if (normalized === expected) {
      return true;
    }

    // カンマで区切られた複数の読み方に対応
    const alternatives = expected.split('、').map(a => a.trim());
    if (alternatives.includes(normalized)) {
      return true;
    }
  }

  return false;
}

/**
 * スコア値を計算（正解数がスコア）
 */
export function calculateScore(questionsCorrect: number): number {
  return questionsCorrect;
}

/**
 * 正答率を計算（パーセンテージ）
 */
export function calculateAccuracy(questionsCorrect: number, total: number = 15): number {
  if (total === 0) return 0;
  return Math.round((questionsCorrect / total) * 100);
}

/**
 * 連続正解記録を更新
 */
export function updateStreak(
  currentStreak: number,
  bestStreak: number,
  isCorrect: boolean
): { currentStreak: number; bestStreak: number } {
  if (isCorrect) {
    const newCurrent = currentStreak + 1;
    const newBest = Math.max(bestStreak, newCurrent);
    return { currentStreak: newCurrent, bestStreak: newBest };
  } else {
    return { currentStreak: 0, bestStreak };
  }
}

/**
 * クリア時間が個人最高かどうかを判定
 */
export function isNewBestTime(newTime: number, previousBestTime?: number): boolean {
  if (!previousBestTime) return true;
  return newTime < previousBestTime;
}

/**
 * モンスターの段階を返す（1～4）
 * 1-5問：段階1, 6-10問：段階2, 11-14問：段階3, 15問：段階4
 */
export function getMonsterStage(questionNumber: number): number {
  if (questionNumber <= 5) return 1;
  if (questionNumber <= 10) return 2;
  if (questionNumber <= 14) return 3;
  return 4;
}
