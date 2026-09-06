import { describe, it, expect } from "vitest";
import { SCHEDULE, dateToKey, getDayOfWeek } from "./types";

describe("dateToKey", () => {
  it("YYYY-MM-DD 形式にする", () => {
    expect(dateToKey(new Date(2026, 8, 2))).toBe("2026-09-02");
  });

  it("月と日を 2 桁にゼロ埋めする", () => {
    expect(dateToKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(dateToKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  // UTC 変換を挟むと 1 日ずれる。ローカルタイムで組み立てていることの確認。
  it("同じ日なら時刻によらず同じキーになる", () => {
    const midnight = new Date(2026, 8, 2, 0, 0, 0);
    const lateNight = new Date(2026, 8, 2, 23, 59, 59);
    expect(dateToKey(midnight)).toBe("2026-09-02");
    expect(dateToKey(lateNight)).toBe("2026-09-02");
  });

  it("閏日を扱える", () => {
    expect(dateToKey(new Date(2024, 1, 29))).toBe("2024-02-29");
  });
});

describe("getDayOfWeek", () => {
  it("日曜が 0、土曜が 6 になる", () => {
    // 2026-09-06 は日曜
    expect(getDayOfWeek(new Date(2026, 8, 6))).toBe(0);
    expect(getDayOfWeek(new Date(2026, 8, 12))).toBe(6);
  });
});

describe("SCHEDULE", () => {
  it("月曜は朝と夜", () => {
    expect(SCHEDULE[1]).toEqual({ morning: true, evening: true });
  });

  it("火曜と木曜は朝のみ", () => {
    expect(SCHEDULE[2]).toEqual({ morning: true, evening: false });
    expect(SCHEDULE[4]).toEqual({ morning: true, evening: false });
  });

  it("水・金・土・日は服用なし", () => {
    for (const day of [3, 5, 6, 0] as const) {
      expect(SCHEDULE[day]).toEqual({ morning: false, evening: false });
    }
  });

  it("全 7 曜日が定義されている", () => {
    expect(Object.keys(SCHEDULE).sort()).toEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
  });
});
