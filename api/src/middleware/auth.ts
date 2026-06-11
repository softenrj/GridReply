import { Request, Response, NextFunction } from 'express';
import sendResponse from '../types/apiRespose.js';
import jwt from "jsonwebtoken";
import Auth from '../service/authToken.js';
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            sessionId: mongoose.Types.ObjectId;
        }
    }
}

function extractToken(req: Request): string | null {
    if (req.headers.authorization?.startsWith("Bearer ")) {
        return req.headers.authorization.split(" ")[1];
    }

    return null;
}


export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        try {
            const token = extractToken(req);
            if (!token) {
                sendResponse(res, 401, { message: "Unauthorized: No token provided", success: false });
                return;
            }

            const decodedToken = Auth.verify(token);

            if (!decodedToken) {
                sendResponse(res, 401, { message: "Session is over", success: false });
                return;
            }

            const code = decodedToken._id;
            req.sessionId = code;

            next();
        } catch (error) {
            console.error('Error auth middleware: ', error);
            sendResponse(res, 401, { message: "Session is over", success: false })
        }
    } catch (error) {
        console.error('[Error] initiate New Session ', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false })
    }
}