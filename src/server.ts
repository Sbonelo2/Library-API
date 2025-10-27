
import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { logger, errorHandler, notFoundHandler } from "./middleware/index";
import authorsRouter from "./routes/authors";
const app: Express = express();
const PORT = process.env.PORT || 3000;
// Security middleware
app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Body parsing middleware
app.use(bodyParser.json());
app.use(logger);

// Base route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Library API",
    endpoints: {
      authors: "/authors",
      docs: "Coming soon...",
    },
  });
});
// Routes
app.use("/authors", authorsRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
