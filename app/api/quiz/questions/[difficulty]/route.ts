import { NextRequest, NextResponse } from 'next/server';
import kanji_questions from '@/data/kanji-questions.json';
import { getDifficultyValueFromKey } from '@/lib/kanji-difficulty';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ difficulty: string }> }
) {
  try {
    const { difficulty } = await params;
    const difficultyKey = difficulty.toLowerCase();

    // Validate difficulty
    let difficultyValue: number;
    try {
      difficultyValue = getDifficultyValueFromKey(
        difficultyKey as
          | 'easy'
          | 'normal'
          | 'hard'
          | 'veryhard'
          | 'hellish'
      );
    } catch {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Get questions for this difficulty
    const questions = kanji_questions[
      difficultyKey as keyof typeof kanji_questions
    ] as Array<{
      type: string;
      kanji: string;
      reading: string;
      correctAnswers: string[];
      answerType: string;
      jlpt: number;
      explanation: string;
    }>;

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for this difficulty' },
        { status: 404 }
      );
    }

    // Shuffle and take exactly 15 questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(15, shuffled.length));

    // Format response
    const formattedQuestions = selected.map((q, index) => ({
      id: `q_${difficultyValue}_${index}`,
      type: q.type,
      kanji: q.kanji,
      reading: q.reading,
      correctAnswers: q.correctAnswers,
      answerType: q.answerType,
      questionText: `「${q.kanji}」の読み方は？`,
      explanation: q.explanation,
    }));

    return NextResponse.json({ questions: formattedQuestions });
  } catch (error) {
    console.error('Question fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
