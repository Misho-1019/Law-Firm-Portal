import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";
import { loginUserChecks, registerUserChecks } from "../validators/user.js";
import { validationResult } from "express-validator";
import { buildLoginEmail, buildRegisterEmail } from "../lib/authEmails.js";
import { sendEmail } from "../lib/mailer.js";

const authController = Router();

const isProd = process.env.NODE_ENV === 'production';

const EMAIL_DISABLED = process.env.EMAIL_DISABLED === '1';

authController.post('/register', isGuest, registerUserChecks, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const authData = req.body;

    try {
        const result = await authService.register(authData);

        // res.cookie('auth', result.token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'lax' : 'lax', maxAge: 2 * 60 * 60 * 1000 }); // 2 hours
        res.cookie('auth', result.token, { httpOnly: true }); // 2 hours

        if (!EMAIL_DISABLED) {
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
        const result = await authService.login(email, password);

        // res.cookie('auth', result.token, { httpOnly: true, secure: isProd, sameSite: isProd ? 'lax' : 'lax', maxAge: 2 * 60 * 60 * 1000 }); // 2 hours
        res.cookie('auth', result.token, { httpOnly: true }); // 2 hours

        if (!EMAIL_DISABLED) {
            const meta = {
                ip: (req.headers['x-forwared-for']?.toString().split(',')[0] || req.ip)?.trim(),
                ua: req.headers['user-agent'],
                time: new Date().toISOString()
            }

            const { subject, html } = buildLoginEmail({ username: result.username, meta })

            sendEmail({ to: result.email, subject, html}).catch((e) =>
                console.error('[email] login failed', e?.message || e)
            )
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message }).end()
    }

    res.end();
})

authController.get('/logout', isAuth, (req, res) => {
    try {
        // res.clearCookie('auth', { httpOnly: true, secure: isProd, sameSite: isProd ? 'lax' : 'lax'  });
        res.clearCookie('auth', { httpOnly: true  });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
})

authController.put('/users/me/password', isAuth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }) 
    }

    const { currentPassword, newPassword } = req.body || {};
    const userId = req.user._id;

    try {
        await authService.changeMyPassword(currentPassword, newPassword, userId)

        res.clearCookie('auth', { httpOnly: true })

        return res.json({ ok: true })
    } catch (err) {
        console.error("changeMyPassword:", err);
        return res.status(400).json({ message: "Server error." });
    }
})

export default authController;