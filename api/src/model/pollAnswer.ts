import mongoose, { ValidatorMessageFn } from "mongoose";
import { IAnswer, PollType } from "../types/poll.js";

const validater = {
    function(v: string) {
        return typeof v === 'string' || typeof v === 'number';
    },

    message: (props: { value: string }) => `${props.value} must be a String or a Number!`
}

const pollAnswerSchema = new mongoose.Schema<IAnswer>({
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'polls', required: true, index: true },
    col: { type: Number, required: true },
    row: { type: Number, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, validate: { validator: validater.function, message: validater.message }, required: true },
    pollType: { type: String, enum: Object.values(PollType), required: true, default: PollType.MCQ },
}, { timestamps: true });

export const PollAnswer = mongoose.model<IAnswer>('poll', pollAnswerSchema);