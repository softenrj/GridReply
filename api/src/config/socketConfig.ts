import { IncomingMessage, OutgoingMessage, Server as NodeServer, ServerResponse } from "node:http";
import { Server } from 'socket.io'
import { logger } from "./logger.js";

function initializeSocket(http: NodeServer<typeof IncomingMessage, typeof ServerResponse>) {
    try {
        const io = new Server(http, {
            cors: { origin: '*', methods: ['GET', 'POST'] }
        })

        io.on('connection', (socket) => {
            logger.color("greenBright").bold(`A user with socket Id: ${socket.id} connected`);
            socket.join(socket.id);


        })

        return io;
    } catch (error) {
        console.error("[Error] initialization Error Socket", error);
        return;
    }
}

export default initializeSocket;