import { Response } from "express"
import { logger } from "../config/logger.js";

/**
 * Types of GridReply Response
 */

export type API_RESPONSE<T> = {
    message?: string;
    data?: T;
    success: boolean
}

/**
 * 
 * @param res 
 * @param status 
 * @param responseObject 
 */
function sendResponse<T>(res: Response, status: number, responseObject: API_RESPONSE<T>) {
    try {
        res.status(status).json({ message: responseObject.message || '', data: responseObject.data || {}, success: responseObject.success });
    } catch (error) {
        logger.error(`Error White Response: ${error}`)
    }
}

export default sendResponse;