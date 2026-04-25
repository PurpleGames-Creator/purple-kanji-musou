import { DifficultySelector } from './components/difficulty-selector';

export const metadata = {
  title: 'Purple漢字無双',
  description: '迫り来る強敵たちをなぎ倒せ。知識の戦場を勝ち抜く漢字クイズゲーム。',
};

export default function Home() {
  return <DifficultySelector />;
}
