// controllers/adminScheduleController.js
import { Router } from "express";
import { body, validationResult } from "express-validator";
import WorkingSchedule from "../models/WorkingSchedule.js";
import TimeOff from "../models/TimeOff.js";
import Settings from "../models/Settings.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import { getCalendarWeek, update } from "../services/availabilityService.js";

const adminScheduleController = Router();

/**
 * GET /admin/schedule
 * Returns the working schedule (or default empty schedule).
 */
adminScheduleController.get("/schedule", async (req, res) => {
  const doc = await WorkingSchedule.findOne().lean();
  res.json(doc || { tz: "Europe/Sofia", days: [] });
});

/**
 * PUT /admin/schedule
 * Upsert the working schedule.
 * days[].weekday: 0–6  (0 = Sunday)
 * days[].intervals[]: { from: "HH:MM", to: "HH:MM" }
 */
adminScheduleController.put("/schedule",  isAdmin,
  [
    body("tz").optional().isString(),
    body("days").isArray(),
    body("days.*.weekday").isInt({ min: 0, max: 6 }),
    body("days.*.intervals").isArray(),
    body("days.*.intervals.*.from").matches(/^\d{2}:\d{2}$/),
    body("days.*.intervals.*.to").matches(/^\d{2}:\d{2}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tz = "Europe/Sofia", days } = req.body;

    const doc = await WorkingSchedule.findOneAndUpdate(
      {},
      { tz, days },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(doc);
  }
);

adminScheduleController.get('/calendar/week', async (req, res) => {
  const fromStr = req.query.from;
  const toStr = req.query.to;

  if (!fromStr || !toStr) {
    return res
      .status(400)
      .json({ message: "Query params 'from' and 'to' are required (YYYY-MM-DD)." })
  }

  try {
    const payload = await getCalendarWeek(fromStr, toStr)

    return res.status(200).json(payload)
  } catch (err) {
    console.error('Error in GET /admin/calendar/week:', err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Failed to build calendar week." })
  }
})

/**
 * GET /admin/timeOff
 * List all time-off blocks ordered by dateFrom.
 */
adminScheduleController.get("/timeOff", async (req, res) => {
  const list = await TimeOff.find().sort({ dateFrom: 1 }).lean();
  res.json({ items: list });
});

/**
 * POST /admin/timeOff
 * Create a new time-off block.
 *
 * Supports:
 * - full-day block:
 *   { dateFrom: "2025-12-01", dateTo: "2025-12-03", reason: "Vacation" }
 *
 * - optional partial-day single date:
 *   { dateFrom: "2025-12-05", dateTo: "2025-12-05", from: "13:00", to: "15:00", reason: "Court" }
 */
adminScheduleController.post("/timeOff",
  isAdmin,
  [
    body("dateFrom").matches(/^\d{4}-\d{2}-\d{2}$/),
    body("dateTo").matches(/^\d{4}-\d{2}-\d{2}$/),
    body("from").optional().matches(/^\d{2}:\d{2}$/),
    body("to").optional().matches(/^\d{2}:\d{2}$/),
    body("reason").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await TimeOff.create(req.body);
    res.status(201).json(item);
  }
);

adminScheduleController.put("/timeOff/:id",  isAdmin, [
    body("dateFrom").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    body("dateTo").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    body("from").optional({ checkFalsy: true }).matches(/^\d{2}:\d{2}$/),
    body("to").optional({ checkFalsy: true }).matches(/^\d{2}:\d{2}$/),
    body("reason").optional().isString(),
], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params;
  const data = req.body;

  try {
    const updatedTimeOff = await update(data, id)

    if (!updatedTimeOff) {
      return res.status(404).json({ message: 'Time off entry not found!' })
    }

    res.status(200).json({ updatedTimeOff })
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ message: error.message })
  }
})

/**
 * DELETE /admin/timeOff/:id
 * Remove a time-off block by ID.
 */
adminScheduleController.delete("/timeOff/:id",  isAdmin, async (req, res) => {
  await TimeOff.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

adminScheduleController.get("/settings", async (_req, res) => {
  const settings = await Settings.findOne().lean() || { firmName: "LexSchedule" };
  res.json(settings);
});

adminScheduleController.get("/lawyers", isAdmin, async (_req, res) => {
  const lawyers = await User.find({ role: "Admin" })
    .select("firstName lastName username email phone")
    .lean();
  res.json(lawyers);
});

adminScheduleController.get("/stats", isAdmin, async (_req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [total, statusGroup, serviceGroup, dailyTrend] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Appointment.aggregate([
      { $group: { _id: "$service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Appointment.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const statusBreakdown = { PENDING: 0, CONFIRMED: 0, DECLINED: 0, CANCELLED: 0 };
  for (const s of statusGroup) statusBreakdown[s._id] = s.count;

  const cancelledCount = statusBreakdown.CANCELLED || 0;
  const cancellationRate = total > 0 ? Math.round((cancelledCount / total) * 100) : 0;

  res.json({
    total,
    statusBreakdown,
    serviceBreakdown: serviceGroup.map((s) => ({ service: s._id, count: s.count })),
    cancellationRate,
    dailyTrend: dailyTrend.map((d) => ({ date: d._id, count: d.count })),
  });
});

adminScheduleController.put("/settings", isAdmin, [
  body("firmName").optional().isString().trim().notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: req.body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(settings);
});

export default adminScheduleController;
