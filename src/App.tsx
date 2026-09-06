import { useState } from "react";
import { Calendar } from "./components/Calendar";
import { MedicationRecord } from "./components/MedicationRecord";
import type { MedicationData } from "./types";

const STORAGE_KEY = "medicationData";

// 初期データの読み込み。読めなかった場合は空で始めるが、保存済みの値は
// 書き換えずに残す（壊れたデータを手で復旧できる余地を残すため）。
function loadData(): MedicationData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load data from localStorage:", error);
    return {};
  }
}

function saveData(data: MedicationData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<MedicationData>(loadData);

  // 記録の更新時にだけ保存する。マウント時には書き込まない。
  const handleRecordChange = (
    dateKey: string,
    timing: "morning" | "evening",
    taken: boolean,
  ) => {
    const next: MedicationData = {
      ...data,
      [dateKey]: {
        ...(data[dateKey] || {}),
        [timing]: taken,
      },
    };
    setData(next);
    saveData(next);
  };

  // 表示中の月以外の日が選ばれたら、その月に移動する
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (
      date.getFullYear() !== currentDate.getFullYear() ||
      date.getMonth() !== currentDate.getMonth()
    ) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth()));
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            💊 medcheck
          </h1>
          <p className="text-gray-600 text-lg">持病の薬の服用記録アプリ</p>
        </div>

        {/* レイアウト */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* カレンダー */}
          <div className="md:col-span-2">
            <div className="mb-4 flex gap-2 justify-center">
              <button
                onClick={goToPreviousMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                ← 前月
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                今月
              </button>
              <button
                onClick={goToNextMonth}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                翌月 →
              </button>
            </div>
            <Calendar
              data={data}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* 記録UI */}
          <div>
            <div className="sticky top-4">
              <MedicationRecord
                date={selectedDate}
                data={data}
                onRecordChange={handleRecordChange}
              />
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>💾 全データはブラウザのローカルストレージに保存されます</p>
        </div>
      </div>
    </div>
  );
}

export default App;
