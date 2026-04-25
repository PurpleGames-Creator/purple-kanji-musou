// JST（日本標準時）での日付範囲を ISO 文字列で返す
export function getJstTodayRangeIso() {
  const jst = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).formatToParts(new Date());

  const year = jst.find(p => p.type === 'year')?.value || '';
  const month = jst.find(p => p.type === 'month')?.value || '';
  const day = jst.find(p => p.type === 'day')?.value || '';

  // 当日 00:00:00 UTC（JST 00:00:00）
  const start = new Date(`${year}-${month}-${day}T00:00:00+09:00`).toISOString();
  // 当日 23:59:59.999 UTC（JST 23:59:59.999）
  const end = new Date(`${year}-${month}-${day}T23:59:59.999+09:00`).toISOString();

  return { start, end };
}

// JST での週の範囲（月曜日～日曜日）を返す
export function getJstWeekRangeIso() {
  const now = new Date();
  const jstDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    timeZone: 'Asia/Tokyo',
  }).formatToParts(now);

  const year = parseInt(jstDate.find(p => p.type === 'year')?.value || '2024');
  const month = parseInt(jstDate.find(p => p.type === 'month')?.value || '01');
  const day = parseInt(jstDate.find(p => p.type === 'day')?.value || '01');
  const weekday = jstDate.find(p => p.type === 'weekday')?.value || '';

  // 月曜日を 1、日曜日を 7 とする
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'].indexOf(weekday.charAt(0));
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startDate = new Date(year, month - 1, day - daysFromMonday);
  const endDate = new Date(year, month - 1, day + (6 - daysFromMonday));

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const start = new Date(`${startStr}T00:00:00+09:00`).toISOString();
  const end = new Date(`${endStr}T23:59:59.999+09:00`).toISOString();

  return { start, end };
}

// JST での月の範囲を返す
export function getJstMonthRangeIso() {
  const jst = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    timeZone: 'Asia/Tokyo',
  }).formatToParts(new Date());

  const year = jst.find(p => p.type === 'year')?.value || '';
  const month = jst.find(p => p.type === 'month')?.value || '';

  const start = new Date(`${year}-${month}-01T00:00:00+09:00`).toISOString();
  // 月の最後の日
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const end = new Date(`${year}-${month}-${lastDay}T23:59:59.999+09:00`).toISOString();

  return { start, end };
}
