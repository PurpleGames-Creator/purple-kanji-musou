import { NextRequest, NextResponse } from 'next/server';
import { validateAnswer } from '@/lib/quiz-logic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput, correctAnswers } = body;

    if (!userInput || !correctAnswers) {
      return NextResponse.json(
        { error: 'Missing userInput or correctAnswers' },
        { status: 400 }
      );
    }

    const isCorrect = validateAnswer(userInput, correctAnswers);

    return NextResponse.json({ isCorrect });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
