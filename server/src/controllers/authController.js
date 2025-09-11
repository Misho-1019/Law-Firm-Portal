import { Router } from "express";
import authService from "../services/authService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const authController = Router();

authController.post('/register', async (req, res) => {
    const authData = req.body;

    await authService.register(authData);

    res.end();
})

authController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password);

        res.cookie('auth', token, { httpOnly: true }); 
    } catch (err) {
        console.log(err.message);
        
    }

    res.end();
})

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.status(200).json({ message: 'Logged out successfully' });
})

export default authController;