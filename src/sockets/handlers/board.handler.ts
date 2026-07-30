import { Server } from "socket.io";
import { AuthenticatedSocket } from "../middlewares/socket-auth.js";
import { logger } from "../../utils/logger.js";

export const registerBoardHandlers = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("join-project", (projectId: string) => {
    const room = `project:${projectId}`;
    socket.join(room);
    logger.info(`User ${socket.user?.userId} joined socket room: ${room}`);
  });

  socket.on("leave-project", (projectId: string) => {
    const room = `project:${projectId}`;
    socket.leave(room);
    logger.info(`User ${socket.user?.userId} left socket room: ${room}`);
  });
};
