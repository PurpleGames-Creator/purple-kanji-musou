export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'veryhard' | 'hellish';

export const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; value: number }> = {
  easy: { label: '簡単', value: 1 },
  normal: { label: '普通', value: 2 },
  hard: { label: '難関', value: 3 },
  veryhard: { label: '激ムズ', value: 4 },
  hellish: { label: '超激ムズ', value: 5 },
};

/**
 * 問題番号（1～15）から漢検レベルを取得
 * 難易度によってレベルが段階的に上がる
 */
export function getJlptLevelForQuestion(difficulty: DifficultyLevel, questionNumber: number): number {
  const config: Record<DifficultyLevel, number[]> = {
    easy: [6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 3],
    normal: [5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2],
    hard: [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1],
    veryhard: [3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
    hellish: [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  };

  return config[difficulty][questionNumber - 1] || 6;
}

/**
 * 難易度レベル（1～5）から難易度キーを取得
 */
export function getDifficultyKeyFromLevel(level: number): DifficultyLevel {
  const mapping: Record<number, DifficultyLevel> = {
    1: 'easy',
    2: 'normal',
    3: 'hard',
    4: 'veryhard',
    5: 'hellish',
  };
  return mapping[level] || 'easy';
}

/**
 * 難易度キーから難易度レベルを取得
 */
export function getDifficultyValueFromKey(key: DifficultyLevel): number {
  return DIFFICULTY_CONFIG[key].value;
}

/**
 * 難易度キーのラベルを取得
 */
export function getDifficultyLabel(key: DifficultyLevel): string {
  return DIFFICULTY_CONFIG[key].label;
}

/**
 * すべての難易度キーを配列で取得
 */
export function getAllDifficultyKeys(): DifficultyLevel[] {
  return Object.keys(DIFFICULTY_CONFIG) as DifficultyLevel[];
}
