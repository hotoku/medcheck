import { useMemo } from "react";
import { dateToKey, getDayOfWeek, SCHEDULE } from "../types";
import type { MedicationData } from "../types";

interface CalendarProps {
  data: MedicationData;
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function Calendar({
  data,
  currentDate,
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  // 当月の日付を生成
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 前月の埋め合わせ
    const startDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // 当月
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // 翌月の埋め合わせ
    const remainingDays = 42 - days.length; // 6週分
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const renderMedicationStatus = (date: Date) => {
    const dayOfWeek = getDayOfWeek(date);
    const schedule = SCHEDULE[dayOfWeek as keyof typeof SCHEDULE];
    const dateKey = dateToKey(date);
    const recordedData = data[dateKey];

    const statuses = [];

    if (schedule.morning) {
      const isTaken = recordedData?.morning;
      statuses.push(
        <span
          key="morning"
          className={`inline-block w-2 h-2 rounded-full ${
            isTaken ? "bg-green-500" : "bg-gray-300"
          }`}
          title="朝食後"
        />,
      );
    }

    if (schedule.evening) {
      const isTaken = recordedData?.evening;
      statuses.push(
        <span
          key="evening"
          className={`inline-block w-2 h-2 rounded-full ${
            isTaken ? "bg-green-500" : "bg-gray-300"
          }`}
          title="夕食後"
        />,
      );
    }

    return statuses.length > 0 ? (
      <div className="flex gap-1 justify-center mt-1">{statuses}</div>
    ) : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </h2>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((dayObj, index) => {
          const { date, isCurrentMonth } = dayObj;
          const isSelectedDate = dateToKey(date) === dateToKey(selectedDate);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={`aspect-square p-2 rounded-lg text-sm font-medium transition-colors ${
                !isCurrentMonth
                  ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  : isToday(date)
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : isSelectedDate
                      ? "bg-blue-200 text-blue-900"
                      : "bg-gray-50 text-gray-900 hover:bg-gray-100"
              }`}
            >
              <div>{date.getDate()}</div>
              {renderMedicationStatus(date)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
