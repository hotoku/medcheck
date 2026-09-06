import { useState } from "react";
import { Calendar } from "./components/Calendar";
import { MedicationRecord } from "./components/MedicationRecord";
import { addDays } from "./calendar";
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
  // 表示している 2 週間の基準日。この日を含む週と、その前の週を出す。
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
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

  const goToPreviousWeek = () => setAnchorDate(addDays(anchorDate, -7));
  const goToNextWeek = () => setAnchorDate(addDays(anchorDate, 7));

  const goToThisWeek = () => {
    const today = new Date();
    setAnchorDate(today);
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
                onClick={goToPreviousWeek}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                ← 前の週
              </button>
              <button
                onClick={goToThisWeek}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                今週
              </button>
              <button
                onClick={goToNextWeek}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                次の週 →
              </button>
            </div>
            <Calendar
              data={data}
              anchorDate={anchorDate}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
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
