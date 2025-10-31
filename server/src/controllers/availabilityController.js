import { Router } from "express";
import { query, validationResult } from "express-validator";
import { getBookableSlotsForDate, getCalendarForMonth } from "../services/availabilityService.js";

const availabilityController = Router();

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

export default availabilityController;