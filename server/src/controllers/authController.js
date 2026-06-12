import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { loginUserChecks, registerUserChecks } from "../validators/user.js";
import { validationResult } from "express-validator";
import { buildPasswordChangedEmail, buildPasswordResetEmail, buildRegisterEmail } from "../lib/authEmails.js";
import { sendEmail } from "../lib/mailer.js";
import User from "../models/User.js";
import { cookieOptions } from "../utils/cookies.js";
import config from "../config.js";
import crypto from "crypto";

const authController = Router();

const EMAILS_DISABLED = config.EMAILS_DISABLED;

authController.post('/register', isGuest, registerUserChecks, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const authData = req.body;

    try {
        const result = await authService.register(authData);

        // res.cookie('auth', result.token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'lax' : 'lax', maxAge: 2 * 60 * 60 * 1000 }); // 2 hours
        res.cookie('auth', result.token, cookieOptions); // 2 hours

        if (!EMAILS_DISABLED) {
            const { subject, html } = buildRegisterEmail({ username: result.username })

            sendEmail({ to: result.email, subject, html }).catch((e) => 
                console.error('[email] register failed:', e?.message || e)
            )
        }

        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({ message: error.message }).end();
    }
})

authController.post('/login', isGuest, loginUserChecks, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body;

    try {
        const meta = {
          ip: (req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.ip)?.trim(),
          ua: req.headers["user-agent"] || "",
          time: new Date().toISOString(),
        };

        const result = await authService.login(email, password, meta);

        // res.cookie('auth', result.token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'lax' : 'lax', maxAge: 2 * 60 * 60 * 1000 }); // 2 hours
        res.cookie('auth', result.token, cookieOptions); // 2 hours

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }
})

authController.get("/logout", (req, res) => {
  try {
    res.clearCookie("auth", cookieOptions);

    // Extra safety: also overwrite cookie in case browser keeps it
    res.cookie("auth", "", { ...cookieOptions, maxAge: 0 });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

authController.put('/users/me/password', isAuth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }) 
    }

    const { currentPassword, newPassword } = req.body || {};
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).select('email username')

        if (!user) {
            return res.status(404).json({ message: 'User not found!' })
        }

        await authService.changeMyPassword(currentPassword, newPassword, userId)

        if (!EMAILS_DISABLED) {
            const meta = {
                ip: (req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip)?.trim(),
                ua: req.headers['user-agent'] || '',
                time: new Date().toISOString(),
            }

            const { subject, html } = buildPasswordChangedEmail({ username: user.username, meta })

            sendEmail({ to: user.email, subject, html }).catch((e) =>
                console.error('[email] password change failed', e?.message || e) 
            )
        }

        res.clearCookie('auth', { httpOnly: true })

        return res.json({ ok: true })
    } catch (err) {
        console.error("changeMyPassword:", err);
        return res.status(400).json({ message: err.message });
    }
})

authController.post("/forgot-password", isGuest, async (req, res) => {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: "Email is required." });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        const clientUrl = config.CLIENT_URLS[0] || "http://localhost:5173";
        const resetLink = `${clientUrl}/reset-password/${token}`;

        if (!EMAILS_DISABLED) {
            const { subject, html } = buildPasswordResetEmail({ username: user.username, resetLink });
            sendEmail({ to: user.email, subject, html }).catch((e) =>
                console.error("[email] forgot-password failed:", e?.message || e)
            );
        }

        return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    } catch (err) {
        console.error("forgot-password:", err);
        return res.status(500).json({ message: "Something went wrong." });
    }
});

authController.post("/reset-password", isGuest, async (req, res) => {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required." });
    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset link." });
        }

        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully. You can now log in." });
    } catch (err) {
        console.error("reset-password:", err);
        return res.status(500).json({ message: "Something went wrong." });
    }
});

authController.put("/users/me/notifications", isAuth, async (req, res) => {
  const { emailNotifications } = req.body || {};
  if (typeof emailNotifications !== "boolean") {
    return res.status(400).json({ message: "emailNotifications must be a boolean." });
  }

  await User.findByIdAndUpdate(req.user._id, { emailNotifications });
  return res.json({ ok: true, emailNotifications });
});

export default authController;