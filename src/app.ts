import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { API_PREFIX } from "./config/constants.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware.js";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

app.use(API_PREFIX, apiRateLimiter, routes);

app.use(errorMiddleware);

export default app;
