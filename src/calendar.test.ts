import { describe, it, expect } from "vitest";
import {
  addDays,
  buildTwoWeekDays,
  formatDateRange,
  startOfWeek,
} from "./calendar";
import { dateToKey } from "./types";

const keys = (dates: Date[]) => dates.map(dateToKey);

describe("startOfWeek", () => {
  it("日曜まで巻き戻す", () => {
    // 2026-09-06 は日曜、9/12 は土曜
    expect(dateToKey(startOfWeek(new Date(2026, 8, 6)))).toBe("2026-09-06");
    expect(dateToKey(startOfWeek(new Date(2026, 8, 9)))).toBe("2026-09-06");
    expect(dateToKey(startOfWeek(new Date(2026, 8, 12)))).toBe("2026-09-06");
  });

  it("月をまたいで巻き戻せる", () => {
    // 2026-09-01 は火曜なので、週の頭は 8/30
    expect(dateToKey(startOfWeek(new Date(2026, 8, 1)))).toBe("2026-08-30");
  });

  it("時刻を落とす", () => {
    const d = startOfWeek(new Date(2026, 8, 9, 23, 59, 59));
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getSeconds()).toBe(0);
  });
});

describe("addDays", () => {
  it("月をまたぐ", () => {
    expect(dateToKey(addDays(new Date(2026, 8, 30), 1))).toBe("2026-10-01");
    expect(dateToKey(addDays(new Date(2026, 8, 1), -1))).toBe("2026-08-31");
  });

  it("年をまたぐ", () => {
    expect(dateToKey(addDays(new Date(2026, 11, 31), 1))).toBe("2027-01-01");
    expect(dateToKey(addDays(new Date(2026, 0, 1), -1))).toBe("2025-12-31");
  });

  it("閏日を飛ばさない", () => {
    expect(dateToKey(addDays(new Date(2024, 1, 28), 1))).toBe("2024-02-29");
    expect(dateToKey(addDays(new Date(2026, 1, 28), 1))).toBe("2026-03-01");
  });
});

describe("buildTwoWeekDays", () => {
  it("14 日分を返す", () => {
    expect(buildTwoWeekDays(new Date(2026, 8, 9)).length).toBe(14);
  });

  it("日曜に始まり土曜に終わる", () => {
    const days = buildTwoWeekDays(new Date(2026, 8, 9));
    expect(days[0].getDay()).toBe(0);
    expect(days[13].getDay()).toBe(6);
  });

  it("基準日を含む週と、その前の週を返す", () => {
    // 2026-09-09（水）を基準にすると 8/30〜9/12
    const days = buildTwoWeekDays(new Date(2026, 8, 9));
    expect(dateToKey(days[0])).toBe("2026-08-30");
    expect(dateToKey(days[13])).toBe("2026-09-12");
    expect(keys(days)).toContain("2026-09-09");
  });

  it("基準日は必ず後半の週に入る", () => {
    for (const day of [6, 7, 8, 9, 10, 11, 12]) {
      const anchor = new Date(2026, 8, day);
      const days = buildTwoWeekDays(anchor);
      const index = keys(days).indexOf(dateToKey(anchor));
      expect(index).toBeGreaterThanOrEqual(7);
      expect(index).toBeLessThanOrEqual(13);
    }
  });

  it("14 日が 1 日ずつ連続している", () => {
    const days = buildTwoWeekDays(new Date(2026, 8, 9));
    for (let i = 1; i < days.length; i++) {
      const diff = days[i].getTime() - days[i - 1].getTime();
      expect(diff).toBe(24 * 60 * 60 * 1000);
    }
  });

  it("同じ週のどの日を基準にしても同じ 14 日になる", () => {
    const sunday = keys(buildTwoWeekDays(new Date(2026, 8, 6)));
    const wednesday = keys(buildTwoWeekDays(new Date(2026, 8, 9)));
    const saturday = keys(buildTwoWeekDays(new Date(2026, 8, 12)));
    expect(wednesday).toEqual(sunday);
    expect(saturday).toEqual(sunday);
  });

  it("時刻に依存しない", () => {
    const morning = keys(buildTwoWeekDays(new Date(2026, 8, 9, 0, 0, 0)));
    const night = keys(buildTwoWeekDays(new Date(2026, 8, 9, 23, 59, 59)));
    expect(night).toEqual(morning);
  });

  it("年をまたぐ", () => {
    // 2027-01-01 は金曜
    const days = keys(buildTwoWeekDays(new Date(2027, 0, 1)));
    expect(days).toContain("2026-12-31");
    expect(days).toContain("2027-01-01");
    expect(days[0]).toBe("2026-12-20");
  });

  it("閏日を含む週を扱える", () => {
    expect(keys(buildTwoWeekDays(new Date(2024, 1, 29)))).toContain(
      "2024-02-29",
    );
  });

  it("1 週前を基準にすると 7 日ずれる", () => {
    const now = keys(buildTwoWeekDays(new Date(2026, 8, 9)));
    const prev = keys(buildTwoWeekDays(addDays(new Date(2026, 8, 9), -7)));
    expect(prev[7]).toBe(now[0]);
  });
});

describe("formatDateRange", () => {
  it("月をまたぐ範囲", () => {
    expect(formatDateRange(new Date(2026, 7, 30), new Date(2026, 8, 12))).toBe(
      "2026年8月30日 〜 9月12日",
    );
  });

  it("同じ月に収まる範囲", () => {
    expect(formatDateRange(new Date(2026, 8, 6), new Date(2026, 8, 19))).toBe(
      "2026年9月6日 〜 9月19日",
    );
  });

  it("年をまたぐときは末尾にも年を出す", () => {
    expect(formatDateRange(new Date(2026, 11, 20), new Date(2027, 0, 2))).toBe(
      "2026年12月20日 〜 2027年1月2日",
    );
  });
});
