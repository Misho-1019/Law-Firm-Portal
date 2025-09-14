import { Router } from "express";
import authController from "./controllers/authController.js";
import appointmentController from "./controllers/appointmentController.js";

const router = Router();

router.use('/auth', authController);
router.use('/appointments', appointmentController)

export default router;