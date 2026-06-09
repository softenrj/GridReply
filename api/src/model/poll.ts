import mongoose from "mongoose";
import { PollDoc, PollOption, PollType } from "../types/poll.js";
import { validater } from "./pollAnswer.js";

const pollSchema = new mongoose.Schema<PollDoc>({
    sessionId: { type: mongoose.Schema.ObjectId, required: true, ref: 'pollsessions', index: true },
    cols: { type: Number, required: true, default: 0 },
    rows: { type: Number, required: true, default: 0 },
    question: { type: String, default: '' },
    pollType: { type: String, enum: Object.values(PollType), required: true, default: PollType.MCQ },
    options: [{ type: { id: String, text: String } }],
    answer: { type: mongoose.Schema.Types.Mixed, validate: { validator: validater.function, message: validater.message }, required: true },
}, { timestamps: true });

export const PollModel = mongoose.model<PollDoc>('polls', pollSchema);