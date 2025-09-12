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
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })

        return token
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
            id: user._id,
            username: user.username,
            email: user.email,
        }

        const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })

        return token 
    }
}