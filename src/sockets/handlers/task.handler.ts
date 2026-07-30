import { Server } from "socket.io";
import { AuthenticatedSocket } from "../middlewares/socket-auth.js";

export const registerTaskHandlers = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("task-moved", (payload: { projectId: string; taskId: string; status: string; position: number }) => {
    socket.to(`project:${payload.projectId}`).emit("task-updated", {
      ...payload,
      updatedBy: socket.user?.userId,
    });
  });

  socket.on("comment-added", (payload: { projectId: string; taskId: string; commentId: string; content: string }) => {
    socket.to(`project:${payload.projectId}`).emit("comment-received", {
      ...payload,
      authorId: socket.user?.userId,
    });
  });
};
