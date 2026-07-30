import { Socket } from "socket.io";
import { verifyToken, JwtPayload } from "../../utils/jwt.js";

export interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

export const socketAuthMiddleware = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new Error("Authentication token required"));
  }

  try {
    const payload = verifyToken(token);
    socket.user = payload;
    next();
  } catch (err) {
    next(new Error("Unauthorized socket connection"));
  }
};
