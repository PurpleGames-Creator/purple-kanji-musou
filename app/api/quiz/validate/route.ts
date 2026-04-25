import { NextRequest, NextResponse } from 'next/server';
import { validateAnswer } from '@/lib/quiz-logic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput, correctAnswer, correctAnswers, answerType } = body;

    if (!userInput || (!correctAnswer && !correctAnswers)) {
      return NextResponse.json(
        { error: 'Missing userInput or correctAnswer' },
        { status: 400 }
      );
    }

    // 新しい形式（correctAnswers配列）をサポート
    const answers = correctAnswers || [correctAnswer];
    const isCorrect = validateAnswer(userInput, answers, answerType);

    return NextResponse.json({ isCorrect });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
