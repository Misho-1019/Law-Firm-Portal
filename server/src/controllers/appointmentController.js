import { Router } from "express";
import { validationResult } from "express-validator";
import appointmentService from "../services/appointmentService.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { idParamCheck, createAppointmentChecks, updateAppointmentChecks } from "../validators/appointment.js";

const appointmentController = Router();

appointmentController.get('/', isAuth, isAdmin, async (req, res) => {
    console.log(req.user);
    try {
        
        const appointments = await appointmentService.getAll()

        res.status(200).json({ appointments })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

appointmentController.get('/mine', isAuth, async (req, res) => {
    try {
        const { status, from, to, limit, skip, sort } = req.query;
        const result = await appointmentService.listMine(req.user.id, {
            status,
            from,
            to,
            limit,
            skip,
            sort,
        });

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

appointmentController.get('/:appointmentId', isAuth, idParamCheck, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const appointmentId = req.params.appointmentId;

    try {
        const appointment = await appointmentService.getOne(appointmentId);

        res.status(200).json(appointment)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

appointmentController.post('/create', isAuth, createAppointmentChecks, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const appointmentData = req.body;
    const creatorId = req.user?.id

    try {
        const newAppointment = await appointmentService.create(appointmentData, creatorId)

        res.status(201).json({ newAppointment })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

appointmentController.patch('/:appointmentId', isAuth, isAdmin, idParamCheck, updateAppointmentChecks, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const appointmentId = req.params.appointmentId;
    const appointmentData = req.body;
    const userId = req.user?.id;

    try {
        const existingAppointment = await appointmentService.getOne(appointmentId)

        if (!existingAppointment) return res.status(404).json({ message: 'Appointment not found!' })
        
        if (existingAppointment.creator.toString() !== userId && req.user?.role !== 'Admin') {
            return res.status(403).json({ message: 'You are not authorized to update this appointment!' })
        }

        if (req.user?.role !== 'Admin' && Object.prototype.hasOwnProperty.call(appointmentData, 'status')) {
            return res.status(403).json({ message: 'Only admin can update the status of an appointment!' })
        }

        const updatedAppointment = await appointmentService.update(appointmentData, appointmentId)

        if(!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found!' })
        }

        res.status(200).json({ updatedAppointment })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

appointmentController.delete('/:appointmentId', isAuth, isAdmin, idParamCheck, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const appointmentId = req.params.appointmentId;
    const userId = req.user?.id;

    try {
        const existingAppointment = await appointmentService.getOne(appointmentId)

        if (!existingAppointment) {
            return res.status(404).json({ message: 'Appointment not found!' })
        }

        if (existingAppointment.creator.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this appointment!' })
        }

        await appointmentService.delete(appointmentId)

        res.status(200).json({ message: 'Appointment deleted successfully!' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

export default appointmentController