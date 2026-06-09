import { Router, Request, Response } from "express";
import sendResponse from "../types/apiRespose.js";

const defaultRouter = Router();


defaultRouter.use('/', (req: Request, res: Response) => {
    try {
        sendResponse(res, 200, { message: 'welcome to the GRIDREPLY by Raj ', success: true, data: {} })
    } catch (error) {
        console.error('[Error] default API route', error);
        sendResponse(res, 500, { message: 'Internal Server Error', success: false })
    }
})

export default defaultRouter;