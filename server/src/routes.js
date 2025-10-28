import { Router } from "express";
import authController from "./controllers/authController.js";
import appointmentController from "./controllers/appointmentController.js";
import availabilityController from "./controllers/availabilityController.js";

const router = Router();

router.use('/auth', authController);
router.use('/appointments', appointmentController)
router.use('/availability', availabilityController)

export default router;