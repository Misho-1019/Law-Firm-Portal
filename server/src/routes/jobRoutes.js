import express from "express";
import { runRemindersOnce } from "../jobs/reminders.js";

const router = express.Router();

/**
 * Cloud Scheduler calls this.
 * Protect it with a shared secret header.
 */
router.post("/reminders/run", async (req, res) => {
  const provided = req.header("x-cron-secret");
  const expected = process.env.CRON_SECRET;

  if (!expected || provided !== expected) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await runRemindersOnce();
    return res.json({ ok: true });
  } catch (err) {
    console.error("[jobs] reminders run failed:", err);
    return res.status(500).json({ ok: false, message: "Run failed" });
  }
});

export default router;
