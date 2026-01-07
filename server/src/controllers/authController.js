import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { loginUserChecks, registerUserChecks } from "../validators/user.js";
import { validationResult } from "express-validator";
import { buildPasswordChangedEmail, buildRegisterEmail } from "../lib/authEmails.js";
import { sendEmail } from "../lib/mailer.js";
import User from "../models/User.js";
import { cookieOptions } from "../utils/cookies.js";

const authController = Router();

const isProd = process.env.NODE_ENV === 'production';

const EMAILS_DISABLED = process.env.EMAILS_DISABLED === '1';

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

export default authController;