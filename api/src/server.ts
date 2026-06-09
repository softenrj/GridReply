import { logger } from "./config/logger.js";
import { createServer } from "node:http";
import app from "./app.js";
import initializeSocket from "./config/socketConfig.js";

const httpServer = createServer(app);
export const IO = initializeSocket(httpServer);
app.set("io", IO);

httpServer.listen(8080, () => {
    logger.color('green', '[GRIDREPLY]: Server is Live at http://localhost:8080/');
})