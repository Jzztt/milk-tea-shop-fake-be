import express from "express";
import dotenv from "dotenv";
import routers from "./routes/index";
import connectMongoDB from "./config/dbConfig";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())
const { PORT, MONGO_URI } = process.env;
connectMongoDB(MONGO_URI);
routers(app);

if (import.meta.env.PROD) app.listen(5000);

export const viteNodeApp = app;