export interface PollSesson {
    _id: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum PollType {
    MCQ = "mcq",
    DEFAULT = "default"
}

export interface PollOption {
    id: string;
    text: string;
}
export interface Poll {
    _id: string;
    question: string;
    pollType: PollType;
    options: PollOption;
    rows: number;
    cols: number;
    answer: number;
    sessionId: string;
    sessionCode: string;
    createdAt: Date;
    updatedAt: Date;
}