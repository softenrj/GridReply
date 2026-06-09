import { Socket } from "socket.io";
import { PollModel } from "../model/poll.js";
import { logger } from "../config/logger.js";
import { PollSessionModel } from "../model/pollSession.js";

function pollSockets(socket: Socket) {

    // socket.on('poll:create-update-poll', async (pay))
    // get poll
    socket.on('poll:get:grid', async (payload: { sessionId: string }) => {
        if (!payload?.sessionId) {
            socket.emit('poll:get:grid:ack', {
                succss: false,
                message: "Session is Envalid"
            })
            return;
        }

        const poll = await PollModel.findOne({ sessionId: payload.sessionId }, {
            sessionId: 0
        })

        socket.emit('poll:get:grid:ack', {
            success: true,
            data: poll,
            message: "poll successfully fetched"
        })
    })

    socket.on("join_session", async (payload: { sessionCode: string }) => {
        const sessionCode = payload.sessionCode;
        if (!sessionCode) return;

        const session = await PollSessionModel.findOne({ code: sessionCode });
        if (!session) {
            socket.emit("joined_status", { success: false, room: null });
            return;
        }

        const roomName = `session:${sessionCode}`;

        socket.join(roomName);
        logger.color("cyan").bold(`Socket ${socket.id} joined room: ${roomName}`);

        socket.emit("joined_status", { success: true, room: roomName });
    });
}

export default pollSockets;