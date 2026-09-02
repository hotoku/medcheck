// 薬のスケジュール定義
export const SCHEDULE = {
  1: { morning: true, evening: true }, // 月曜: 朝・夜
  2: { morning: true, evening: false }, // 火曜: 朝のみ
  3: { morning: false, evening: false }, // 水曜: なし
  4: { morning: false, evening: false }, // 木曜: なし
  5: { morning: false, evening: false }, // 金曜: なし
  6: { morning: false, evening: false }, // 土曜: なし
  0: { morning: false, evening: false }, // 日曜: なし
};

// スケジュールのラベル
export const TIMING_LABELS = {
  morning: "朝食後",
  evening: "夕食後",
};

// 日付キーの型
export type DateKey = string; // "2026-09-02"

// 各タイミングの服用状態
export type TimingStatus = Record<"morning" | "evening", boolean>;

// 全体のデータ構造
export type MedicationData = Record<DateKey, Partial<TimingStatus>>;

// 曜日の取得（0=日曜, 1=月曜, ...）
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

// 日付をキーに変換
export function dateToKey(date: Date): DateKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// キーを日付に変換
export function keyToDate(key: DateKey): Date {
  return new Date(key);
}

// 曜日名を取得
export function getDayName(dayOfWeek: number): string {
  const names = ["日", "月", "火", "水", "木", "金", "土"];
  return names[dayOfWeek];
}
