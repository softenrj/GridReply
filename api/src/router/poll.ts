import { Router } from "express";
import * as pollController from "../controller/pollController.js";
import { isAuth } from "../middleware/auth.js";

const pollRoute = Router();

pollRoute.post('/new-session', pollController.initiateNewSession);
pollRoute.post('/poll/', isAuth, pollController.createPoll);
pollRoute.patch('/poll/:pollId', isAuth, pollController.updatePoll);
pollRoute.get('/get-poll/:sessionId', pollController.getPoll);

export default pollRoute;