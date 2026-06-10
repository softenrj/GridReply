import express from "express";
import apiRouteV1 from "./router.js";
import connectDb from "./config/database.js";
import dns from 'node:dns';
import cors from "cors";
import morgan from "morgan";
import { IO } from "./server.js";

dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
app.use(morgan('dev'));

const allowedOrigin: string[] = ["http://localhost:3000"]

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigin.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Origin is Not Allowed!'), false);
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use('/api/v1', apiRouteV1);

export default app;


