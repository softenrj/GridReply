import { Socket } from "socket.io";
import pollSockets from "./sockets/poll.js";

export const registerSocketHandlers = (socket: Socket) => {
    pollSockets(socket);
}