import { Router, Request, Response, NextFunction } from "express";
import {
  Author,
  authors,
  createAuthor,
  findAuthorById,
  updateAuthor,
  deleteAuthor,
} from "../models/author";
import { findBooksByAuthorId } from "../models/book";
import { ApiError } from "../middleware";

const router = Router();

// Create Author
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      throw new ApiError(400, "Author name is required");
    }

    const author = createAuthor(req.body);
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

// Get all authors
router.get("/", (req: Request, res: Response) => {
  res.json(authors);
});

// Get author by ID
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = findAuthorById(req.params.id);
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    res.json(author);
  } catch (error) {
    next(error);
  }
});

// Update author
router.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name) {
      throw new ApiError(400, "Author name is required");
    }

    const author = updateAuthor(req.params.id, req.body);
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    res.json(author);
  } catch (error) {
    next(error);
  }
});

// Delete author
router.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = deleteAuthor(req.params.id);
    if (!success) {
      throw new ApiError(404, "Author not found");
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get books by author ID
router.get("/:id/books", (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = findAuthorById(req.params.id);
    if (!author) {
      throw new ApiError(404, "Author not found");
    }
    const books = findBooksByAuthorId(req.params.id);
    res.json(books);
  } catch (error) {
    next(error);
  }
});

export default router;
