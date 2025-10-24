import express from "express";
import bodyParser from "body-parser";
import { logger, errorHandler } from "./middleware";
import authorRoutes from "./routes/authors";
import bookRoutes from "./routes/books";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
