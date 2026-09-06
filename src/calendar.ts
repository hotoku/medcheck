// 週の始まりは日曜。時刻を落としてその日の 0 時にそろえる。
export function startOfWeek(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay(),
  );
}

// 日数を足した日付を返す。月・年をまたぐ場合も Date が繰り上げてくれる。
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

// anchorDate を含む週と、その 1 つ前の週。あわせて 14 日分を日曜始まりで返す。
export function buildTwoWeekDays(anchorDate: Date): Date[] {
  const start = addDays(startOfWeek(anchorDate), -7);
  return Array.from({ length: 14 }, (_, i) => addDays(start, i));
}

// 「2026年8月30日 〜 9月12日」。年をまたぐときだけ末尾にも年を出す。
export function formatDateRange(start: Date, end: Date): string {
  const head = `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`;
  const tail =
    end.getFullYear() === start.getFullYear()
      ? `${end.getMonth() + 1}月${end.getDate()}日`
      : `${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`;
  return `${head} 〜 ${tail}`;
}
