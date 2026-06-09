import mongoose from "mongoose";
import { PollSessionDoc } from "../types/poll.js";

const pollSessionSchema = new mongoose.Schema<PollSessionDoc>({
    code: { type: String, required: true, index: true },
}, { timestamps: true });

export const PollSessionModel = mongoose.model<PollSessionDoc>('pollsessions', pollSessionSchema);