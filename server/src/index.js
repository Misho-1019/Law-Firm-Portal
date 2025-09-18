import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

try {
    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri)
    console.log('Successfully connected to the database');
    
} catch (error) {
    console.log('Could not connect to the database');
    console.log(error.message);
}

app.use(express.json());

app.use(cookieParser());
app.use(authMiddleware)
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`))

    