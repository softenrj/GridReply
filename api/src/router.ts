import { Application, Router } from "express";
import defaultRouter from "./router/index.js";
import pollRoute from "./router/poll.js";

const apiRouteV1 = Router();

apiRouteV1.use('/poll', pollRoute)
apiRouteV1.use(defaultRouter)


export default apiRouteV1;