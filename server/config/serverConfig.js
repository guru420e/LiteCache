import express from "express"
import cors from "cors"
import cache from "../cache/EvictionPolicy.js"
import http from "http";
import { Server as SocketIO } from "socket.io"
import { ioLogger } from "../utils/helpers.js";

const app = express();
const server = http.createServer(app);

// Will be changed in the future and will only work when the user is 
const io = new SocketIO(server, {
    cors: {
        origin: "*",//All request are allowed right know
    }
});

app.use(
    cors({
        origin: "*",
    })
);


// Logs the socket Id on console 
io.on("connection", ioLogger);

// will be set from the query params in the future
cache.config({
    limit: 2,
    io,
})

export {
    io,
    app,
    server,
    express,
}




