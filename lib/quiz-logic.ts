/**
 * ユーザー入力が正解かどうかを判定
 * 仕様：答えはひらがなのみ（漢字が含まれていたら不正解）
 * 送り仮名対応：「すわる」の場合「すわ」でも正解
 */
export function validateAnswer(
  userInput: string,
  correctAnswers: string[] | string
): boolean {
  const normalized = userInput.trim();

  // 漢字が含まれていたら不正解
  if (hasKanji(normalized)) {
    return false;
  }

  // 複数の正解に対応
  const answerList = Array.isArray(correctAnswers) ? correctAnswers : [correctAnswers];

  // ひらがナンバージョンのみを抽出（correctAnswersの1番目がひらがな）
  const hiraganaAnswers = answerList.filter(a => isHiragana(a.trim()));

  // 完全一致判定
  for (const correctAnswer of hiraganaAnswers) {
    if (normalized === correctAnswer.trim()) {
      return true;
    }
  }

  // 送り仮名を除いた形式も判定
  // 例：「すわる」→「る」を除いた「すわ」も正解
  // 長い送り仮名を先に判定（greedy matching）
  const okuriPatterns = [
    // 4文字以上
    'させる', 'られる', 'ている', 'ました', 'ません',
    // 3文字
    'ない', 'たい', 'ける', 'める', 'しい', 'かい', 'さい', 'きい',
    // 2文字
    'る', 'わる', 'ぎる', 'びる', 'ぐ', 'ぶ', 'む', 'ぬ', 'つ', 'す', 'ず',
    // 形容詞の送り仮名
    'い', 'いい',
    // その他の助動詞・助詞
    'た', 'だ', 'です', 'ます', 'ず'
  ];

  for (const correctAnswer of hiraganaAnswers) {
    const trimmed = correctAnswer.trim();

    for (const okuri of okuriPatterns) {
      if (trimmed.endsWith(okuri)) {
        const withoutOkuri = trimmed.slice(0, -okuri.length);
        if (normalized === withoutOkuri && withoutOkuri.length > 0) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * 文字列がすべてひらがなかどうかを判定
 * マクロン（ー）も許可（例：でぃすこーす）
 */
function isHiragana(str: string): boolean {
  return /^[ぁ-ん゙ ゚ー]+$/.test(str);
}

/**
 * 文字列に漢字が含まれているかどうかを判定
 */
function hasKanji(str: string): boolean {
  return /[\u4e00-\u9fff]/.test(str);
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
