import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import router from "./routes.js";

const app = express();

try {
    const uri = process.env.MONGO_URI;

    await mongoose.connect(uri)
    console.log('Successfully connected to the database');
    
} catch (error) {
    console.log('Could not connect to the database');
    console.log(error.message);
}

app.use(express.json());

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`))

    