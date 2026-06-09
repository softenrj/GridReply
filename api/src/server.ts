import { logger } from "./config/logger.js";
import app from "./app.js";


app.listen(8080, () => {
    logger.color('green','[GRIDREPLY]: Server is Live at 8080');
})