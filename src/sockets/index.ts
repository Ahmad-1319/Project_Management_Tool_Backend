import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { socketAuthMiddleware, AuthenticatedSocket } from "./middlewares/socket-auth.js";
import { registerBoardHandlers } from "./handlers/board.handler.js";
import { registerTaskHandlers } from "./handlers/task.handler.js";
import { logger } from "../utils/logger.js";

export let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket: AuthenticatedSocket) => {
    logger.info(`⚡ Socket connected: ${socket.id} (User: ${socket.user?.email})`);

    registerBoardHandlers(io, socket);
    registerTaskHandlers(io, socket);

    socket.on("disconnect", () => {
      logger.info(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
