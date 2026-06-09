import mongoose from "mongoose";
import { IPollSession } from "../types/poll.js";

const pollSessionSchema = new mongoose.Schema<IPollSession>({
    code: { type: String, required: true, index: true },
}, { timestamps: true });

export const PollSessionModel = mongoose.model<IPollSession>('pollsessions', pollSessionSchema);