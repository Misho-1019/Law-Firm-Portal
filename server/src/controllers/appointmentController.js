import { Router } from "express";
import appointmentService from "../services/appointmentService";

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