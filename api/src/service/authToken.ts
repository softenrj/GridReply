import jwt from "jsonwebtoken";
import { PollDoc, PollType } from "../types/poll.js";
const secret = process.env.JWT_SECRET!;

class Auth {
    /**
     * 
     * @param payload 
     * @returns 
     */
    public static getToken = (payload: PollDoc) => {
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });
        return token;
    }

    /**
     * 
     * @param token 
     * @returns 
     */
    public static verify = (token: string): PollDoc => {
        const payload = jwt.verify(token, secret) as PollDoc;
        return payload;
    }
}

export default Auth;