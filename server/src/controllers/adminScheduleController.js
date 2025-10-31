import { Router } from "express";
import { body, validationResult } from "express-validator";
import WorkingSchedule from "../models/WorkingSchedule.js";
import TimeOff, {  } from "../models/TimeOff.js";

const adminScheduleController = Router();

adminScheduleController.get('/schedule', async (req, res) => {
    const doc = await WorkingSchedule.findOne().lean();
    res.json(doc || { tz: 'Europe/Sofia', days: [] });
})

adminScheduleController.put('/schedule', [
    body('tz').optional().isString(),
    body('days').isArray(),
    body('days.*.weekday').isInt({ min: 0, max: 6 }),
    body('days.*.intervals').isArray(),
    body('days.*.intervals.*.from').matches(/^\d{2}:\d{2}$/),
    body('days.*.intervals.*.to').matches(/^\d{2}:\d{2}$/),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { tz = 'Europe/Sofia', days } = req.body;

    const doc = await WorkingSchedule.findOneAndUpdate({}, { tz, days }, { upsert: true, new: true, setDefaultsOnInsert: true })
    res.json(doc);
})

adminScheduleController.get('/timeOff', async (req, res) => {
    const list = await TimeOff.find().sort({ dateFrom: 1 }).lean();

    res.json({ items: list })
})

adminScheduleController.post('/timeOff', [
    body('dateFrom').matches(/^\d{4}-\d{2}-\d{2}$/),
    body('dateTo').matches(/^\d{4}-\d{2}-\d{2}$/),
    body('reason').optional().isString(),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const item = await TimeOff.create(req.body);

    res.status(201).json(item)
})

adminScheduleController.delete('/timeOff/:id', async (req, res) => {
    await TimeOff.findByIdAndDelete(req.params.id)

    res.sendStatus(204);
})

export default adminScheduleController;