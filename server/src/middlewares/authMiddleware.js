import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRET = process.env.SECRET_KEY || 'BASICSECRET';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies['auth'];

    if(!token) return next();

    try {
        const decodedToken = jwt.verify(token, SECRET)

        const user = await User.findById(decodedToken._id).select('role tokenVersion')

        const tokenVersion = decodedToken.tokenVersion ?? 0;
        if (!user || user.tokenVersion !== tokenVersion) {
            res.clearCookie('auth')
            return res.status(401).json({ message: 'Session expired. Please log in again.' })
        }

        req.user = {_id: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion }
        res.locals.user = req.user;

        next();
    } catch (error) {
        res.clearCookie('auth');

        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export const isAuth = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    next();
}

export const isGuest = (req, res, next) => {
    if(req.user) {
        return res.status(403).json({ message: 'You are already logged in'  })
    }

    next();
}

export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "Admin") {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
}