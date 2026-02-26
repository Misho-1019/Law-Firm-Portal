import { Router } from "express";
import authController from "./controllers/authController.js";
import appointmentController from "./controllers/appointmentController.js";
import availabilityController from "./controllers/availabilityController.js";
import adminScheduleController from "./controllers/adminScheduleController.js";
import { isAdmin, isAuth } from "./middlewares/authMiddleware.js";
import jobRoutes from "./routes/jobRoutes.js";

const router = Router();

router.use('/api/auth', authController);
router.use('/api/appointments', appointmentController)
router.use('/api/availability', availabilityController)
router.use('/api/admin', isAuth, adminScheduleController)
router.use('/api/jobs', jobRoutes)

export default router;