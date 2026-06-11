import { describe, it, expect, vi, beforeEach } from "vitest";
import { DateTime } from "luxon";

const mockFindOneLean = vi.fn();
const mockFindLean = vi.fn();
const mockTimeOffLean = vi.fn();
const mockApptSelectLean = vi.fn();

vi.mock("../models/WorkingSchedule.js", () => ({
  default: {
    findOne: () => ({ lean: mockFindOneLean }),
  },
}));
vi.mock("../models/Appointment.js", () => ({
  default: {
    find: () => ({ select: () => ({ lean: mockApptSelectLean }) }),
    countDocuments: vi.fn(),
  },
}));
vi.mock("../models/TimeOff.js", () => ({
  default: {
    find: () => ({ lean: mockTimeOffLean }),
  },
}));

const { getBookableSlotsForDate, getCalendarForMonth } = await import("../services/availabilityService.js");

function slotTimes(slots) {
  return slots.map((s) =>
    DateTime.fromISO(s, { zone: "utc" }).setZone("Europe/Sofia").toFormat("HH:mm")
  );
}

const MONDAY = "2026-06-08";

describe("getBookableSlotsForDate", () => {
  beforeEach(() => {
    mockFindOneLean.mockReset();
    mockApptSelectLean.mockReset();
    mockTimeOffLean.mockReset();
    mockFindOneLean.mockResolvedValue(null);
    mockApptSelectLean.mockResolvedValue([]);
    mockTimeOffLean.mockResolvedValue([]);
  });

  it("returns empty on a weekend", async () => {
    const slots = await getBookableSlotsForDate({ dateISO: "2026-06-07" });
    expect(slots).toEqual([]);
  });

  it("returns 15 slots for 60-min on default weekday", async () => {
    const slots = await getBookableSlotsForDate({ dateISO: MONDAY, durationMin: 60 });
    const times = slotTimes(slots);
    expect(times).toContain("09:00");
    expect(times).toContain("16:00");
    expect(times).toHaveLength(15);
  });

  it("returns 9 slots for 240-min duration", async () => {
    const slots = await getBookableSlotsForDate({ dateISO: MONDAY, durationMin: 240 });
    expect(slotTimes(slots)).toHaveLength(9);
  });

  it("enforces 60-min gap between appointments", async () => {
    const startsAt = new Date("2026-06-08T06:00:00.000Z");
    mockApptSelectLean.mockResolvedValue([{ startsAt, durationMin: 120 }]);

    const slots = await getBookableSlotsForDate({ dateISO: MONDAY, durationMin: 60 });
    const times = slotTimes(slots);
    expect(times).not.toContain("09:00");
    expect(times).not.toContain("10:00");
    expect(times).toContain("12:00");
  });

  it("full-day time-off blocks all slots", async () => {
    mockTimeOffLean.mockResolvedValue([{ dateFrom: MONDAY, dateTo: MONDAY }]);
    const slots = await getBookableSlotsForDate({ dateISO: MONDAY, durationMin: 60 });
    expect(slots).toEqual([]);
  });

  it("partial time-off blocks only specified hours", async () => {
    mockTimeOffLean.mockResolvedValue([{ dateFrom: MONDAY, dateTo: MONDAY, from: "13:00", to: "17:00" }]);
    const slots = await getBookableSlotsForDate({ dateISO: MONDAY, durationMin: 60 });
    const times = slotTimes(slots);
    expect(times).toContain("12:00");
    expect(times).not.toContain("13:00");
  });

  it("uses custom working schedule intervals", async () => {
    mockFindOneLean.mockResolvedValue({
      days: [{ weekday: 1, intervals: [{ from: "10:00", to: "14:00" }] }],
    });
    const slots = await getBookableSlotsForDate({ dateISO: MONDAY, durationMin: 60 });
    const times = slotTimes(slots);
    expect(times).toContain("10:00");
    expect(times).not.toContain("09:00");
    expect(times).toContain("13:00");
  });
});

describe("getCalendarForMonth", () => {
  beforeEach(() => {
    mockFindOneLean.mockReset();
    mockApptSelectLean.mockReset();
    mockTimeOffLean.mockReset();
    mockFindOneLean.mockResolvedValue(null);
    mockApptSelectLean.mockResolvedValue([]);
    mockTimeOffLean.mockResolvedValue([]);
  });

  it("returns 30 days for June 2026", async () => {
    const result = await getCalendarForMonth({ month: "2026-06" });
    expect(result.days).toHaveLength(30);
  });

  it("each day has expected properties", async () => {
    const result = await getCalendarForMonth({ month: "2026-06" });
    const first = result.days[0];
    expect(first).toHaveProperty("date");
    expect(first).toHaveProperty("hasSlots");
    expect(first).toHaveProperty("count");
    expect(first).toHaveProperty("isTimeOff");
  });
});
