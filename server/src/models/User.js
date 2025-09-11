import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        minLength: 2,
        unique: true,
        trim: true, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        match: /\@[a-zA-Z]+.[a-zA-Z]+$/,
        minLength: 8, 
    },
    password: { 
        type: String, 
        required: true,
        minLength: 6,
        match: /^\w+$/,
        trim: true,
    }
})

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 10);
})

const User = model('User', userSchema)

export default User;