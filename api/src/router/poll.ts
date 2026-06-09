import { Router } from "express";
import * as pollController from "../controller/pollController.js";

const pollRoute = Router();

pollRoute.post('/new-session', pollController.initiateNewSession)

export default pollRoute;