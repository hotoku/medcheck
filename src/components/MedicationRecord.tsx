import { dateToKey, getDayOfWeek, SCHEDULE } from "../types";
import type { MedicationData } from "../types";

interface MedicationRecordProps {
  date: Date;
  data: MedicationData;
  onRecordChange: (
    dateKey: string,
    timing: "morning" | "evening",
    taken: boolean,
  ) => void;
}

export function MedicationRecord({
  date,
  data,
  onRecordChange,
}: MedicationRecordProps) {
  const dateKey = dateToKey(date);
  const dayOfWeek = getDayOfWeek(date);
  const schedule = SCHEDULE[dayOfWeek as keyof typeof SCHEDULE];
  const recordedData = data[dateKey] || {};

  const needsRecording = schedule.morning || schedule.evening;

  if (!needsRecording) {
    return (
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-2">
          {date.toLocaleDateString("ja-JP", {
            month: "numeric",
            day: "numeric",
            weekday: "short",
          })}
        </h3>
        <p className="text-gray-600">本日は薬を飲む必要がありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <h3 className="text-lg font-bold mb-6">
        {date.toLocaleDateString("ja-JP", {
          month: "numeric",
          day: "numeric",
          weekday: "short",
        })}
      </h3>

      <div className="space-y-3">
        {/* 朝食後 */}
        {schedule.morning && (
          <button
            onClick={() => {
              const newStatus = !recordedData.morning;
              onRecordChange(dateKey, "morning", newStatus);
            }}
            className={`w-full py-4 px-4 rounded-lg font-semibold text-lg transition-all ${
              recordedData.morning
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {recordedData.morning ? "✓" : "○"} 朝食後
            {recordedData.morning ? " - 飲みました！" : " - 未記録"}
          </button>
        )}

        {/* 夕食後 */}
        {schedule.evening && (
          <button
            onClick={() => {
              const newStatus = !recordedData.evening;
              onRecordChange(dateKey, "evening", newStatus);
            }}
            className={`w-full py-4 px-4 rounded-lg font-semibold text-lg transition-all ${
              recordedData.evening
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {recordedData.evening ? "✓" : "○"} 夕食後
            {recordedData.evening ? " - 飲みました！" : " - 未記録"}
          </button>
        )}
      </div>

      {/* 本日かどうか */}
      {dateToKey(new Date()) === dateKey && (
        <p className="text-center text-sm text-blue-600 mt-6 font-semibold">
          📅 本日です
        </p>
      )}
    </div>
  );
}
