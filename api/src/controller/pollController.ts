import { Request, Response } from "express";
import sendResponse from "../types/apiRespose.js";
import crypto from "node:crypto";
import { PollSessionModel } from "../model/pollSession.js";
import { PollModel } from "../model/poll.js";
import { fromZodError } from "zod-validation-error";
import * as z from "zod";
import { PollDoc, PollSchema, PollType } from "../types/poll.js";
import mongoose from "mongoose";
import Auth from "../service/authToken.js";

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
        const { rows, cols, question, answer, pollType, options } = parsedBody.data;

        const poll = await PollModel.create({ sessionId: new mongoose.Types.ObjectId(sessionId), cols, rows, question, options, pollType, answer });
        const session = await PollSessionModel.findById(sessionId);

        const io = req.app.get('io');

        if (io && session?.code) {
            const roomName = `session:${session?.code}`;

            io.to(roomName).emit("poll_updated", {
                pollId: poll._id,
                updatedData: poll
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


        const poll = await PollModel.findByIdAndUpdate(pollId, PollSchema);

        if (!poll) {
            sendResponse(res, 404, { message: "Poll not found", success: false });
            return;
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
        const { sessionId } = req.params;

        if (!sessionId) {
            sendResponse(res, 400, { message: "Invalid or missing Session ID", success: false });
            return;
        }

        const poll = await PollModel.findOne({ sessionId: sessionId });

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