// src/controllers/appointmentController.js
import { Router } from "express";
import { validationResult } from "express-validator";
import appointmentService from "../services/appointmentService.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { idParamCheck, createAppointmentChecks, updateAppointmentChecks } from "../validators/appointment.js";
import availabilityService from "../services/availabilityService.js";

const appointmentController = Router();

/**
 * Admin: list all appointments (Sofia-aware filters)
 * Supports:
 *  - fromLocal / toLocal (e.g. "2025-11-05T00:00:00") interpreted as Europe/Sofia
 *  - from / to (UTC with Z/offset; if no offset, treated as Sofia by the service)
 *  - timezone (optional; defaults to Europe/Sofia)
 */
appointmentController.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const {
      status,
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
      limit,
      skip,
      sort,
      clientId,
    } = req.query;

    const result = await appointmentService.getAll({
      status,
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
      clientId,
      limit,
      skip,
      sort,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Client: list my appointments (Sofia-aware filters)
 */
appointmentController.get("/mine", isAuth, async (req, res) => {
  try {
    const {
      status,
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
      limit,
      skip,
      sort,
    } = req.query;

    const result = await appointmentService.listMine(req.user.id, {
      status,
      from,
      to,
      fromLocal,
      toLocal,
      timezone,
      limit,
      skip,
      sort,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Get one appointment
 */
appointmentController.get("/:appointmentId", isAuth, idParamCheck, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const appointmentId = req.params.appointmentId;
    try {
      const appointment = await appointmentService.getOne(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found!" });
      }
      // Model's toJSON transform will format dates to Sofia on res.json()
      return res.status(200).json(appointment);
    } catch (error) {
      return res.status(404).json({ message: error.message });
    }
  }
);

/**
 * Create appointment
 * Body can include EITHER:
 *  - startsAtLocal: "YYYY-MM-DDTHH:mm:ss" and optional timezone (defaults to Europe/Sofia)
 *  - OR startsAt: ISO instant with Z/offset
 * Service will compute DST-safe reminders by Sofia clock.
 */
appointmentController.post("/create", isAuth, createAppointmentChecks, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const appointmentData = { ...req.body };
    const creatorId = req.user?.id;

    try {
      const dateISO = new Date(startsAt).toISOString().slice(0,10)
      const allowed = await availabilityService.getSlotsForDate({ dateISO, durationMin })

      const chosenISO = new Date(startsAt).toISOString();

      if (!allowed.includes(chosenISO)) {
        return res.status(409).json({ message: 'Selected start time is no longer available.'})
      }

      const newAppointment = await appointmentService.create(
        appointmentData,
        creatorId
      );
      return res.status(201).json({ newAppointment });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({ message: error.message });
    }
  }
);

/**
 * Update appointment (owner or admin)
 * Accepts same time inputs as create.
 * Service will recompute reminders if time changes.
 */
appointmentController.patch("/:appointmentId", isAuth, idParamCheck, updateAppointmentChecks, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentId = req.params.appointmentId;
    const appointmentData = { ...req.body };
    const userId = req.user?.id;

    try {
      const existingAppointment = await appointmentService.getOne(appointmentId);
      if (!existingAppointment) {
        return res
          .status(404)
          .json({ message: "Appointment not found!" });
      }

      const isOwner =
        existingAppointment.creator?.toString() === userId ||
        existingAppointment.creator === userId;
      const isAdmin = req.user?.role === "Admin";

      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized to update this appointment!" });
      }

      if (!isAdmin && Object.prototype.hasOwnProperty.call(appointmentData, "status")) {
        return res
          .status(403)
          .json({ message: "Only admin can update the status of an appointment!" });
      }

      // No time normalization or reminder math here — service handles it
      const updatedAppointment = await appointmentService.update(
        appointmentData,
        appointmentId
      );

      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found!" });
      }

      return res.status(200).json({ updatedAppointment });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({ message: error.message });
    }
  }
);

/**
 * Cancel (or otherwise change status) endpoint
 * Your service currently sets status to CANCELLED for non-admins (and enforces 24h rule).
 * No reminder recomputation here; cancel does not need reminders.
 */
appointmentController.patch("/:appointmentId/status", isAuth, idParamCheck, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    const appointmentId = req.params.appointmentId;
    const user = req.user;

    try {
      const updatedAppointment = await appointmentService.updateStatus(
        appointmentId,
        user
      );

      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found!" });
      }

      return res.status(200).json({ updatedAppointment });
    } catch (error) {
      const status = error.status || 500;
      return res.status(status).json({ message: error.message });
    }
  }
);

/**
 * Delete appointment (admin-only in your current setup)
 */
appointmentController.delete("/:appointmentId", isAuth, isAdmin, idParamCheck, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const appointmentId = req.params.appointmentId;

    try {
      const existingAppointment = await appointmentService.getOne(appointmentId);
      if (!existingAppointment) {
        return res.status(404).json({ message: "Appointment not found!" });
      }

      await appointmentService.delete(appointmentId);
      return res
        .status(200)
        .json({ message: "Appointment deleted successfully!" });
    } catch (error) {
      const status = error.status || 404;
      return res.status(status).json({ message: error.message });
    }
  }
);

export default appointmentController;
