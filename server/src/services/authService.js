import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

export default {
    async register(authData) {
        
        return User.create(authData)
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

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' })

        return { token }
    }
}