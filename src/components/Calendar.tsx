import { useMemo } from "react";
import { buildTwoWeekDays, formatDateRange } from "../calendar";
import { dateToKey, getDayOfWeek, SCHEDULE } from "../types";
import type { MedicationData } from "../types";

interface CalendarProps {
  data: MedicationData;
  anchorDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function Calendar({
  data,
  anchorDate,
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const days = useMemo(() => buildTwoWeekDays(anchorDate), [anchorDate]);

  const isToday = (date: Date) => dateToKey(date) === dateToKey(new Date());

  const renderMedicationStatus = (date: Date) => {
    const schedule = SCHEDULE[getDayOfWeek(date) as keyof typeof SCHEDULE];
    const recordedData = data[dateToKey(date)];

    const statuses = [];

    if (schedule.morning) {
      statuses.push(
        <span
          key="morning"
          className={`inline-block w-2 h-2 rounded-full ${
            recordedData?.morning ? "bg-green-500" : "bg-gray-300"
          }`}
          title="朝食後"
        />,
      );
    }

    if (schedule.evening) {
      statuses.push(
        <span
          key="evening"
          className={`inline-block w-2 h-2 rounded-full ${
            recordedData?.evening ? "bg-green-500" : "bg-gray-300"
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
          {formatDateRange(days[0], days[13])}
        </h2>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体（先週・今週の 2 行） */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const isSelectedDate = dateToKey(date) === dateToKey(selectedDate);

          return (
            <button
              key={dateToKey(date)}
              onClick={() => onDateSelect(date)}
              className={`aspect-square p-2 rounded-lg text-sm font-medium transition-colors ${
                isToday(date)
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
