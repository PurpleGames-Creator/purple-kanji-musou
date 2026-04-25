import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type DifficultyStats = {
  difficulty: string;
  attempts: number;
  totalCorrect: number;
  bestTime?: number;
  averageTime?: number;
  accuracy: number;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get all scores for this player
    const { data, error } = await supabase
      .from('kanji_scores')
      .select('*')
      .eq('nickname', nickname);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        nickname,
        stats: [],
        totalAttempts: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
      });
    }

    // Group by difficulty and calculate stats
    const difficultyMap = new Map<
      string,
      { scores: typeof data; totalCorrect: number }
    >();

    data.forEach((score) => {
      if (!difficultyMap.has(score.difficulty)) {
        difficultyMap.set(score.difficulty, { scores: [], totalCorrect: 0 });
      }
      const entry = difficultyMap.get(score.difficulty)!;
      entry.scores.push(score);
      entry.totalCorrect += score.questions_correct;
    });

    // Build stats per difficulty
    const stats: DifficultyStats[] = [];
    let totalAttempts = 0;
    let totalCorrect = 0;

    difficultyMap.forEach((entry, difficulty) => {
      const { scores, totalCorrect: correctCount } = entry;
      const attempts = scores.length;
      const bestScore = scores.reduce(
        (best, curr) =>
          curr.questions_correct > best.questions_correct ||
          (curr.questions_correct === best.questions_correct &&
            curr.clear_time_seconds < best.clear_time_seconds)
            ? curr
            : best,
        scores[0]
      );

      const totalQuestions = scores.reduce(
        (sum, s) => sum + s.questions_total,
        0
      );
      const accuracy = Math.round((correctCount / totalQuestions) * 100);
      const averageTime =
        scores.reduce((sum, s) => sum + s.clear_time_seconds, 0) /
        attempts;

      stats.push({
        difficulty,
        attempts,
        totalCorrect: correctCount,
        bestTime: bestScore.clear_time_seconds,
        averageTime,
        accuracy,
      });

      totalAttempts += attempts;
      totalCorrect += correctCount;
    });

    // Sort by difficulty
    const difficultyOrder = ['easy', 'normal', 'hard', 'veryhard', 'hellish'];
    stats.sort(
      (a, b) =>
        difficultyOrder.indexOf(a.difficulty) -
        difficultyOrder.indexOf(b.difficulty)
    );

    const overallAccuracy = Math.round(
      (totalCorrect / (totalAttempts * 15)) * 100
    );

    return NextResponse.json({
      nickname,
      stats,
      totalAttempts,
      totalCorrect,
      overallAccuracy,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
