import { Router, Request, Response, NextFunction } from "express";
import {
  Book,
  books,
  createBook,
  findBookById,
  updateBook,
  deleteBook,
  findBooksByAuthorId,
} from "../models/book";
import { ApiError } from "../middleware";

const router = Router();

// Validation middleware
const validateBook = (req: Request, res: Response, next: NextFunction) => {
  const { title, authorId, isbn, publishedYear } = req.body;
  const errors: string[] = [];

  if (!title?.trim()) {
    errors.push("Title is required");
  }

  if (!authorId?.trim()) {
    errors.push("Author ID is required");
  }

  if (!isbn?.trim()) {
    errors.push("ISBN is required");
  }

  if (!publishedYear) {
    errors.push("Published year is required");
  } else if (
    typeof publishedYear !== "number" ||
    publishedYear < 1000 ||
    publishedYear > new Date().getFullYear()
  ) {
    errors.push("Invalid published year");
  }

  if (errors.length > 0) {
    throw new ApiError(400, errors.join(", "));
  }

  next();
};

// Create Book
router.post(
  "/",
  validateBook,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  }
);

// Get all books
router.get("/", (req: Request, res: Response) => {
  res.json(books);
});

// Get book by ID
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = findBookById(req.params.id);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
});

// Update book
router.put(
  "/:id",
  validateBook,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = updateBook(req.params.id, req.body);
      if (!book) {
        throw new ApiError(404, "Book not found");
      }
      res.json(book);
    } catch (error) {
      next(error);
    }
  }
);

// Delete book
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = deleteBook(req.params.id);
    if (!success) {
      throw new ApiError(404, "Book not found");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
