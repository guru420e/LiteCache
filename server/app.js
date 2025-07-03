import cacheRouter from "./routes/cacheRoutes.js";
import {
    app, server, express
} from "./config/serverConfig.js";
import { serverLogger } from "./utils/helpers.js";

app.use(express.json());

app.use("/cache", cacheRouter);


// Take the port uses from dotenv in future
server.listen(3000, serverLogger);
