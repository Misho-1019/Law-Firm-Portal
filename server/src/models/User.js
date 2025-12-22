import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
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
        minLength: 6, 
    },
    password: { 
        type: String, 
        required: true,
        minLength: 6,
        match: /^\w+$/,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['Client', 'Admin'],
        default: 'Client'
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    tokenVersion: {
        type: Number,
        default: 0,
    }
}, 
{
    timestamps: { createdAt: 'createdAt'},
    versionKey: false,
})

userSchema.pre('save', async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
}

const User = model('User', userSchema)

export default User;