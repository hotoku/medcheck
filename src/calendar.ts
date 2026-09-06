// カレンダーに並べる 1 マス分
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

// 指定した月のカレンダーに並べる日付を作る。
// 日曜始まりの 6 週間分（42 マス）を返し、前後の余りは隣の月の日で埋める。
export function buildCalendarDays(currentDate: Date): CalendarDay[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const days: CalendarDay[] = [];

  // 前月の埋め合わせ
  const startDayOfWeek = new Date(year, month, 1).getDay();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }

  // 当月
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  // 翌月の埋め合わせ（6 週分に満たない分）
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
  }

  return days;
}
