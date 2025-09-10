import User from "../models/User.js"

export default {
    async register(authData) {
        
        return User.create(authData)
    }
}