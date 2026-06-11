import { Socket, io } from "socket.io-client";
import { defaultApiRoute } from "../utils/contants";

const socket: Socket | null = null;

export const getSocket = (): Socket | null => {
    if (!socket) {
        if (typeof window === 'undefined') return null;
        return connectSocket();
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
        console.log("Bricks:webSocket connected with id:", socket!.id);
    });

    socket.on("disconnect", () => {
        console.log("Bricks:webSocket disconnected");
    });

    socket.on("reconnect", () => {
        console.log("Bricks:webSocket reconnected");
    });

    socket.on("reconnect_failed", () => {
        console.log("Bricks:webSocket reconnection failed");
    });

    if (socket) {
        socket.connect();
    }

    return socket;
}