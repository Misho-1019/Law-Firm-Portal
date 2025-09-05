import express from "express";
import dotenv from "dotenv";
import router from "./routes.js";


const app = express();

dotenv.config();

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`))

    