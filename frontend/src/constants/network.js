import { io } from "socket.io-client";

export const NETWORK_URL = "http://localhost:3000";

export const socket = io(NETWORK_URL);
