import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
})

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 10);
})

const User = model('User', userSchema)

export default User;