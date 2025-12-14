import { Router } from "express";
import { query, validationResult } from "express-validator";
import availabilityService, { getBookableSlotsForDate, getCalendarForMonth } from "../services/availabilityService.js";

const availabilityController = Router();

const DEFAULT_DURATION_MIN = 120;

availabilityController.get('/calendar', [
    query('month').matches(/^\d{4}-\d{2}$/),
    query('durationMin').optional().isInt({ min: 15, max: 480 }).toInt(),
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { month } = req.query;

    const durationMin = req.query.durationMin || undefined;

    const data = await getCalendarForMonth({ month, durationMin });

    res.json(data);
})

availabilityController.get('/slots', [
    query('date').matches(/^\d{4}-\d{2}-\d{2}$/),
    query('durationMin').optional().isInt({ min: 15, max: 480 }).toInt(),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const { date } = req.query;
    const durationMin = req.query.durationMin || undefined;

    const slots = await getBookableSlotsForDate({ dateISO: date, durationMin })

    res.json({ slots })
})

availabilityController.get('/next', async (req, res) => {
    try {
        const days = Number(req.query.days || 7)
        const duration = Number(req.query.duration || DEFAULT_DURATION_MIN)

        const result = await availabilityService.getNextFreeSlotsRange(days, duration)

        res.json(result)
    } catch (err) {
        console.error('Error in GET /availability/next:', err);
        res.status(500).json({ message: 'Failed to load next free slots.' })
    }
})

export default availabilityController;