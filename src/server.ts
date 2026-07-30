import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSocket } from "./sockets/index.js";
import { prisma } from "./config/db.js";
import { logger } from "./utils/logger.js";

const server = http.createServer(app);

initSocket(server);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connection established successfully");

    server.listen(env.PORT, () => {
      logger.info(
        `🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`,
      );
      logger.info(
        `📡 API endpoint available at http://localhost:${env.PORT}/api/v1`,
      );
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = async () => {
  logger.info("Shutting down server gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server closed & database disconnected.");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startServer();
