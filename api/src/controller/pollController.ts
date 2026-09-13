import { Request, Response } from "express";
import sendResponse from "../types/apiRespose.js";
import crypto from "node:crypto";
import { PollSessionModel } from "../model/pollSession.js";
import { PollModel } from "../model/poll.js";
import { fromZodError } from "zod-validation-error";
import { PollDoc, PollSchema, PollType } from "../types/poll.js";
import mongoose from "mongoose";
import Auth from "../service/authToken.js";
import { PollAnswer } from "../model/pollAnswer.js";

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const initiateNewSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const newCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        if (!newCode) {
            sendResponse(res, 400, { message: 'Something went wrong', success: false });
            return;
        }

        const poll = await PollSessionModel.create({ code: newCode });

        if (!poll) {
            sendResponse(res, 400, { message: 'Something went wrong', success: false });
            return;
        }
        const token = Auth.getToken(poll.toObject() as any);

        sendResponse(res, 201, { message: 'New poll Session is created Successfully', data: { poll: poll, token: token }, success: true });
    } catch (error) {
        console.error('[Error] initiate New Session ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false })
    }
}

// create
/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const sessionId = req.sessionId;

        if (!sessionId) {
            sendResponse(res, 400, { message: "Invalid or missing Session ID", success: false });
            return;
        }

        const parsedBody = PollSchema.safeParse(req.body);

        if (!parsedBody.success) {
            const cleanErrorMessage = fromZodError(parsedBody.error).message;
            sendResponse(res, 400, { message: cleanErrorMessage, success: false });
            return;
        }
        const { rows, cols, question, answer, pollType, options, sessionCode } = parsedBody.data;

        const existedPoll = await PollModel.exists({ sessionCode });

        if (existedPoll) {
            sendResponse(res, 400, { success: false, data: {}, message: "poll is already created" });
            return;
        }

        const poll = await PollModel.create({ sessionId: new mongoose.Types.ObjectId(sessionId), cols, rows, question, options, pollType, answer, sessionCode });
        const session = await PollSessionModel.findById(sessionId);

        const io = req.app.get('io');

        if (io && session?.code) {
            const roomName = `session:${session?.code}`;

            io.to(roomName).emit("poll_updated", {
                pollId: poll._id,
                data: poll,
                success: true,
                message: "poll is created"
            });
        }

        sendResponse(res, 201, { message: "Successfully created poll", success: true, data: poll });

    } catch (error) {
        console.error('[Error] creating poll ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
};

/**
 *
 * @param req 
 * @param res 
 * @returns 
 */
export const updatePoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;
        const sessionId = req.sessionId;

        if (!sessionId) {
            sendResponse(res, 400, { message: "Invalid or missing Session ID", success: false });
            return;
        }

        if (!pollId) {
            sendResponse(res, 400, { message: "Invalid or missing Poll ID", success: false });
            return;
        }

        const parsedBody = PollSchema.partial().safeParse(req.body);

        if (!parsedBody.success) {
            const cleanErrorMessage = fromZodError(parsedBody.error).message;
            sendResponse(res, 400, { message: cleanErrorMessage, success: false });
            return;
        }


        const poll = await PollModel.findByIdAndUpdate(pollId, { $set: parsedBody.data }, { new: true });

        if (!poll) {
            sendResponse(res, 404, { message: "Poll not found", success: false });
            return;
        }

        const io = req.app.get('io');

        if (io && poll?.sessionCode) {
            const roomName = `session:${poll?.sessionCode}`;

            io.to(roomName).emit("poll_updated", {
                pollId: poll._id,
                data: poll,
                message: "updated poll",
                success: true
            });
        }

        sendResponse(res, 200, { message: 'poll updated successfully', data: poll, success: true });
    } catch (error) {
        console.error('[Error] update poll ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionCode } = req.params;

        if (!sessionCode) {
            sendResponse(res, 400, { message: "Invalid or missing session code", success: false });
            return;
        }

        const poll = await PollModel.findOne({ sessionCode });

        if (!poll) {
            sendResponse(res, 404, { message: "Poll not found", success: false });
            return;
        }

        sendResponse(res, 200, { message: "successfully get Poll", success: true, data: poll });
    } catch (error) {
        console.error('[Error] get poll ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns {void}
 */
export const answerPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionCode } = req.params;

        if (!sessionCode) {
            sendResponse(res, 400, { message: "Invalid or missing session code", success: false });
            return;
        }

        const { col, row, pollId, pollType, answer } = req.body;

        if (!pollId) {
            sendResponse(res, 400, { message: "Poll id is required", success: false });
            return;
        }

        if (!col || !row || (typeof col !== 'number' || typeof row !== 'number')) {
            sendResponse(res, 400, { message: "Invalid Row and Col", success: false });
            return;
        }

        const pllAnswer = await PollAnswer.create({ col, row, answer: answer as string, pollId: pollId as string, pollType: pollType as PollType });

        const io = req.app.get('io');

        if (io) {
            const roomName = `session:${sessionCode}`;

            io.to(roomName).emit("poll_answer", {
                col: col,
                row: row,
                answer: answer,
                success: true,
                message: "poll answer"
            });
        }

        sendResponse(res, 200, { message: "successfully set Answer", success: true, })
    } catch (error) {
        console.error('[Error] Answer poll ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
}

/**
 * Reveal answers - returns all answers with correctness status
 * @param req 
 * @param res 
 * @returns 
 */
export const revealAnswers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;

        if (!pollId) {
            sendResponse(res, 400, { message: "Invalid or missing poll id", success: false });
            return;
        }

        const poll = await PollModel.findById(pollId);

        if (!poll) {
            sendResponse(res, 404, { message: "Poll not found", success: false });
            return;
        }

        const answers = await PollAnswer.find({ pollId });

        // Map answers with their correctness status
        const answersWithStatus = answers.map((ans) => ({
            row: ans.row,
            col: ans.col,
            answer: ans.answer,
            isCorrect: ans.answer === poll.answer,
            _id: ans._id
        }));

        const io = req.app.get('io');

        if (io && poll?.sessionCode) {
            const roomName = `session:${poll?.sessionCode}`;

            io.to(roomName).emit("poll_reveal_answers", {
                answers: answersWithStatus,
                correctAnswer: poll.answer,
                success: true,
                message: "answers revealed"
            });
        }

        sendResponse(res, 200, {
            message: "Answers revealed successfully",
            success: true,
            data: { answers: answersWithStatus, correctAnswer: poll.answer }
        });
    } catch (error) {
        console.error('[Error] Reveal answers ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
}

/**
 * Reset poll - deletes all answers and resets the grid
 * @param req 
 * @param res 
 * @returns 
 */
export const resetPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;

        if (!pollId) {
            sendResponse(res, 400, { message: "Invalid or missing poll id", success: false });
            return;
        }

        const poll = await PollModel.findById(pollId);

        if (!poll) {
            sendResponse(res, 404, { message: "Poll not found", success: false });
            return;
        }

        await PollAnswer.deleteMany({ pollId });

        const io = req.app.get('io');

        if (io && poll?.sessionCode) {
            const roomName = `session:${poll?.sessionCode}`;

            io.to(roomName).emit("poll_reset_grid", {
                success: true,
                message: "grid reset"
            });
        }

        sendResponse(res, 200, { message: "Poll reset successfully", success: true });
    } catch (error) {
        console.error('[Error] Reset poll ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
}

/**
 * Get all answers for a poll - for persistence on page load
 * @param req 
 * @param res 
 * @returns 
 */
export const getAnswers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pollId } = req.params;

        if (!pollId) {
            sendResponse(res, 400, { message: "Invalid or missing poll id", success: false });
            return;
        }

        const answers = await PollAnswer.find({ pollId });

        sendResponse(res, 200, {
            message: "Answers fetched successfully",
            success: true,
            data: answers
        });
    } catch (error) {
        console.error('[Error] Get answers ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false });
    }
}