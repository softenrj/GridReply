import mongoose from "mongoose";
import * as z from "zod";

export const pollSessionSchema = z.object({
    code: z.string().length(6),
    col: z.number().min(0),
    row: z.number().min(0),
});

export type PollSessionInput = z.infer<typeof pollSessionSchema>;

export type PollSessionDoc = PollSessionInput & {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export enum PollType {
    MCQ = "mcq",
    DEFAULT = "default"
}

export const PollOption = z.object({
    id: z.number(),
    text: z.string()
})

export const PollSchema = z.object({
    question: z.string(),
    pollType: z.enum(PollType),
    options: z.array(PollOption).optional(),
    rows: z.number().gt(0),
    cols: z.number().gt(0),
    answer: z.number().or(z.string())
})
export type PollDoc = z.infer<typeof PollSchema> & {
    _id: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const AnswerSchema = z.object({
    question: z.string(),
    pollType: z.enum(PollType),
    row: z.number().gt(0),
    col: z.number().gt(0),
    answer: z.number().or(z.string())
})

export type AnswerDoc = z.infer<typeof AnswerSchema> & {
    _id: mongoose.Types.ObjectId;
    pollId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}