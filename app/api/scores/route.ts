import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nickname,
      difficulty,
      questionsCorrect,
      questionsTotal,
      clearTimeSeconds,
    } = body;

    // Validate input
    if (
      !nickname ||
      !difficulty ||
      questionsCorrect == null ||
      questionsTotal == null ||
      clearTimeSeconds == null
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert score
    const { data, error } = await supabase
      .from('kanji_scores')
      .insert([
        {
          nickname: nickname.trim(),
          difficulty,
          questions_correct: questionsCorrect,
          questions_total: questionsTotal,
          clear_time_seconds: clearTimeSeconds,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save score' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Score save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
