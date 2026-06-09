import mongoose from "mongoose";

export interface IPollSession {
    _id: mongoose.Types.ObjectId;
    code: string;
    col: number;
    row: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum PollType {
    MCQ = "mcq",
    DEFAULT = "default"
}

export interface IPollOption {
    id: string;
    text: string;
}
export interface IPoll {
    _id: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
    question: string;
    pollType: PollType;
    options: IPollOption;
    rows: number;
    cols: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAnswer {
    _id: mongoose.Types.ObjectId;
    pollId: mongoose.Types.ObjectId;
    row: number;
    col: number;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
}