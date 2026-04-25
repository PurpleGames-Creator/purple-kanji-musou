import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getJstTodayRangeIso,
  getJstWeekRangeIso,
} from '@/lib/jst-date';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ difficulty: string }> }
) {
  try {
    const { difficulty } = await params;
    const period = request.nextUrl.searchParams.get('period') || 'alltime';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let dateFilter = '';
    if (period === 'today') {
      const { start, end } = getJstTodayRangeIso();
      dateFilter = `created_at.gte.${start},created_at.lte.${end}`;
    } else if (period === 'week') {
      const { start, end } = getJstWeekRangeIso();
      dateFilter = `created_at.gte.${start},created_at.lte.${end}`;
    }

    // Fetch and rank scores
    let query = supabase
      .from('kanji_scores')
      .select('*')
      .eq('difficulty', difficulty);

    if (period === 'today') {
      const { start, end } = getJstTodayRangeIso();
      query = query.gte('created_at', start).lte('created_at', end);
    } else if (period === 'week') {
      const { start, end } = getJstWeekRangeIso();
      query = query.gte('created_at', start).lte('created_at', end);
    }

    query = query
      .order('questions_correct', { ascending: false })
      .order('clear_time_seconds', { ascending: true })
      .limit(100);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rankings' },
        { status: 500 }
      );
    }

    // Calculate ranks and deduplicate by nickname (keep best score)
    const seen = new Set<string>();
    const ranked = data
      .filter((score) => {
        if (seen.has(score.nickname)) return false;
        seen.add(score.nickname);
        return true;
      })
      .map((score, index) => ({
        ...score,
        rank: index + 1,
        accuracy: Math.round((score.questions_correct / score.questions_total) * 100),
      }))
      .slice(0, 100);

    return NextResponse.json({ rankings: ranked, period });
  } catch (error) {
    console.error('Ranking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
