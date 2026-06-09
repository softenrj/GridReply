import mongoose from "mongoose";
import { IPoll, IPollOption, PollType } from "../types/poll.js";

const pollSchema = new mongoose.Schema<IPoll>({
    sessionId: { type: mongoose.Schema.ObjectId, required: true, ref: 'pollsessions', index: true },
    cols: { type: Number, required: true, default: 0 },
    rows: { type: Number, required: true, default: 0 },
    question: { type: String, default: '' },
    pollType: { type: String, enum: Object.values(PollType), required: true, default: PollType.MCQ },
    options: [{ type: { id: String, text: String } }]
}, { timestamps: true });

export const PollModel = mongoose.model<IPoll>('polls', pollSchema);