import { Socket, io } from "socket.io-client";
import { defaultApiRoute } from "../../utils/contants";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
    if (!socket) {
        if (typeof window === 'undefined') return null;
        return socket = connectSocket();
    }
    return socket;
}

const connectSocket = (): Socket => {
    if (typeof window === "undefined") return null as any;
    const socket = io(defaultApiRoute, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    })

    socket.on("connect", () => {
        console.log("GridReply:webSocket connected with id:", socket!.id);
    });

    socket.on("disconnect", () => {
        console.log("GridReply:webSocket disconnected");
    });

    socket.on("reconnect", () => {
        console.log("GridReply:webSocket reconnected");
    });

    socket.on("reconnect_failed", () => {
        console.log("GridReply:webSocket reconnection failed");
    });

    if (socket) {
        socket.connect();
    }

    return socket;
}