import { Request, Response } from "express";
import sendResponse from "../types/apiRespose.js";
import crypto from "node:crypto";
import { PollSessionModel } from "../model/pollSession.js";

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const initiateNewSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const newCode = crypto.randomBytes(6).toString('hex').toUpperCase();

        if (!newCode) {
            sendResponse(res, 500, { message: 'Something went wrong', success: false });
            return;
        }

        const poll = await PollSessionModel.create({ code: newCode });

        if (!poll) {
            sendResponse(res, 500, { message: 'Something went wrong', success: false });
            return;
        }

        sendResponse(res, 200, { message: 'New poll Session is created Successfully', data: poll, success: true });
    } catch (error) {
        console.error('[Error] initiate New Session ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false })
    }
}

export const createPoll = async (req: Request, res: Response): Promise<void> => {
    try {
        const code = req.params.code;

        if (!code) {
            sendResponse(res, 401, { message: "Envalid code", success: false });
            return;
        }

        const { } = req.body;
    } catch (error) {
        console.error('[Error] initiate New Session ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false })
    }
}