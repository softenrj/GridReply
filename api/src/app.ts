import express from "express";
import apiRouteV1 from "./router.js";
import connectDb from "./config/database.js";
import dns from 'node:dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use('/api/v1', apiRouteV1);

export default app;


