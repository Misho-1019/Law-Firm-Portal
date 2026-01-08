import { Router } from "express";
import authController from "./controllers/authController.js";
import appointmentController from "./controllers/appointmentController.js";
import availabilityController from "./controllers/availabilityController.js";
import adminScheduleController from "./controllers/adminScheduleController.js";
import { isAdmin, isAuth } from "./middlewares/authMiddleware.js";
import jobRoutes from "./routes/jobRoutes.js";

const router = Router();

router.use('/auth', authController);
router.use('/appointments', appointmentController)
router.use('/availability', availabilityController)
router.use('/admin', isAuth, adminScheduleController)
router.use('/jobs', jobRoutes)

export default router;