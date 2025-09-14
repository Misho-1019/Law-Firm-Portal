import { Router } from "express";
import appointmentService from "../services/appointmentService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const appointmentController = Router();

appointmentController.get('/', async (req, res) => {
    try {
        const appointments = await appointmentService.getAll()

        res.status(200).json(appointments)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

appointmentController.get('/:appointmentId', async (req, res) => {
    const appointmentId = req.params.appointmentId;

    try {
        const appointment = await appointmentService.getOne(appointmentId);

        res.status(200).json(appointment)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

appointmentController.post('/create', isAuth, async (req, res) => {
    const appointmentData = req.body;
    const creatorId = req.user?.id

    try {
        const newAppointment = await appointmentService.create(appointmentData, creatorId)

        res.status(201).json(newAppointment)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default appointmentController