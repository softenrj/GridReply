import { Router } from "express";
import * as pollController from "../controller/pollController.js";
import { isAuth } from "../middleware/auth.js";

const pollRoute = Router();

pollRoute.post('/new-session', pollController.initiateNewSession);
pollRoute.post('/poll/', isAuth, pollController.createPoll);
pollRoute.patch('/poll/:pollId', isAuth, pollController.updatePoll);
pollRoute.get('/get-poll/:sessionCode', pollController.getPoll);

pollRoute.post('/poll-answer/:sessionCode', pollController.answerPoll);
pollRoute.post('/reveal-answers/:pollId', isAuth, pollController.revealAnswers);
pollRoute.post('/reset-poll/:pollId', isAuth, pollController.resetPoll);
pollRoute.get('/answers/:pollId', pollController.getAnswers);

export default pollRoute;