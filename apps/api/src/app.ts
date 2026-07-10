import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { importRouter } from "./routes/import.routes";
import { errorHandler } from "./middleware/error-handler.middleware";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ["GET", "POST"],
    })
  );
  app.use(express.json());

  app.use("/api", importRouter);

  app.use(errorHandler);

  return app;
}
