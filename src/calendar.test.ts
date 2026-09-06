import { describe, it, expect } from "vitest";
import { buildCalendarDays } from "./calendar";
import { dateToKey } from "./types";

const keys = (date: Date) => buildCalendarDays(date).map((d) => dateToKey(d.date));

describe("buildCalendarDays", () => {
  it("常に 6 週間分 42 マスを返す", () => {
    // 月初の曜日と月の長さの組み合わせを一通り
    for (const [year, month] of [
      [2026, 0],
      [2026, 1],
      [2026, 8],
      [2024, 1], // 閏年の 2 月
      [2027, 7],
    ] as const) {
      expect(buildCalendarDays(new Date(year, month)).length).toBe(42);
    }
  });

  it("日曜に始まり土曜に終わる", () => {
    const days = buildCalendarDays(new Date(2026, 8));
    expect(days[0].date.getDay()).toBe(0);
    expect(days[41].date.getDay()).toBe(6);
  });

  it("42 日が 1 日ずつ連続している", () => {
    const days = buildCalendarDays(new Date(2026, 8));
    for (let i = 1; i < days.length; i++) {
      const diff = days[i].date.getTime() - days[i - 1].date.getTime();
      expect(diff).toBe(24 * 60 * 60 * 1000);
    }
  });

  it("当月の日をすべて含み、isCurrentMonth が立っている", () => {
    // 2026-09 は 30 日まで
    const current = buildCalendarDays(new Date(2026, 8)).filter(
      (d) => d.isCurrentMonth,
    );
    expect(current.length).toBe(30);
    expect(dateToKey(current[0].date)).toBe("2026-09-01");
    expect(dateToKey(current[29].date)).toBe("2026-09-30");
  });

  it("前月の埋め合わせは isCurrentMonth が false になる", () => {
    // 2026-09-01 は火曜なので、日・月の 2 マスを 8 月で埋める
    const days = buildCalendarDays(new Date(2026, 8));
    expect(days.slice(0, 2).every((d) => !d.isCurrentMonth)).toBe(true);
    expect(dateToKey(days[0].date)).toBe("2026-08-30");
    expect(dateToKey(days[1].date)).toBe("2026-08-31");
    expect(days[2].isCurrentMonth).toBe(true);
  });

  it("月初が日曜なら前月の埋め合わせが無い", () => {
    // 2026-02-01 は日曜
    const days = buildCalendarDays(new Date(2026, 1));
    expect(days[0].date.getDay()).toBe(0);
    expect(days[0].isCurrentMonth).toBe(true);
    expect(dateToKey(days[0].date)).toBe("2026-02-01");
  });

  it("閏年の 2 月は 29 日を含む", () => {
    expect(keys(new Date(2024, 1))).toContain("2024-02-29");
  });

  it("平年の 2 月は 29 日を含まない", () => {
    expect(keys(new Date(2026, 1))).not.toContain("2026-02-29");
  });

  it("年をまたぐ月でも連続する", () => {
    const days = buildCalendarDays(new Date(2026, 11)); // 12 月
    const k = days.map((d) => dateToKey(d.date));
    expect(k).toContain("2026-12-31");
    expect(k).toContain("2027-01-01");
  });

  it("1 月では前月の埋め合わせが前年 12 月になる", () => {
    const days = buildCalendarDays(new Date(2026, 0));
    // 2026-01-01 は木曜なので日〜水の 4 マスが 2025-12
    expect(dateToKey(days[0].date)).toBe("2025-12-28");
    expect(days[0].isCurrentMonth).toBe(false);
  });

  it("引数の日にちには依存せず、月だけで決まる", () => {
    const first = keys(new Date(2026, 8, 1));
    const middle = keys(new Date(2026, 8, 15));
    const last = keys(new Date(2026, 8, 30));
    expect(middle).toEqual(first);
    expect(last).toEqual(first);
  });
});
