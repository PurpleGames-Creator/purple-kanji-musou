import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      kanji_questions: {
        Row: {
          id: string;
          difficulty: number;
          jlpt_level: number;
          kanji: string;
          question_type: string;
          question_text: string;
          correct_answer: string;
          explanation: string | null;
          created_at: string;
        };
      };
      kanji_scores: {
        Row: {
          id: string;
          nickname: string;
          difficulty: number;
          questions_correct: number;
          questions_total: number;
          clear_time_seconds: number;
          created_at: string;
        };
      };
      kanji_streaks: {
        Row: {
          id: string;
          nickname: string;
          difficulty: number;
          current_streak: number;
          best_streak: number;
          last_updated: string;
        };
      };
    };
  };
};
