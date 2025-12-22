import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

const SECRET = process.env.SECRET_KEY || 'BASICSECRET';

export default {
    async register(authData) {
        const userCount = await User.countDocuments({ email: authData.email })

        if (userCount > 0) {
            throw new Error('Email already exists!')
        }
        
        const user = await User.create(authData)

        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })

        return {
            token,
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone
        }
    },
    async login(email, password) {
        const user = await User.findOne({ email })

        if(!user) {
            throw new Error('Invalid email or password!')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            throw new Error('Invalid email or password!')
        }

        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })

        return {
            token,
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone
        } 
    },
    async changeMyPassword(currentPassword, newPassword, userId) {
        if (!currentPassword || !newPassword) {
            throw new Error('CurrentPassword and newPassword are required.')
        }

        if (newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters.')
        }

        if (!/^\w+$/.test(newPassword)) {
            throw new Error('New password may contain only letters, numbers, and _.')
        }

        const user = await User.findById(userId)

        if (!user) {
            throw new Error('User not found.')
        }

        const ok = await user.comparePassword(currentPassword)

        if (!ok) {
            throw new Error('Current password is incorrect.')
        }

        const same = await bcrypt.compare(newPassword, user.password)

        if (same) {
            throw new Error('New password must be different from the current one.')
        }

        user.password = newPassword;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        await user.save();
    }
}