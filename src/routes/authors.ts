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

    // Prevent duplicate authors by name (case-insensitive)
    const existing = authors.find(
      (a) => a.name.trim().toLowerCase() === req.body.name.trim().toLowerCase()
    );
    if (existing) {
      throw new ApiError(409, "Author already exists", "conflict", {
        field: "name",
      });
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

    // Query params: q, genre, minYear, maxYear, sort, page, limit
    const q = (req.query.q as string | undefined)?.trim();
    const genre = (req.query.genre as string | undefined)?.trim();
    const minYear = req.query.minYear ? Number(req.query.minYear) : undefined;
    const maxYear = req.query.maxYear ? Number(req.query.maxYear) : undefined;
    const sort = (req.query.sort as string | undefined) || "publishedYear:desc";
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    let results = findBooksByAuthorId(req.params.id);

    // Searching (q) across title, isbn, genre
    if (q) {
      const qLower = q.toLowerCase();
      results = results.filter(
        (b) =>
          b.title.toLowerCase().includes(qLower) ||
          b.isbn.toLowerCase().includes(qLower) ||
          (b.genre || "").toLowerCase().includes(qLower)
      );
    }

    // Genre filter
    if (genre) {
      const gLower = genre.toLowerCase();
      results = results.filter((b) => (b.genre || "").toLowerCase() === gLower);
    }

    // Year range filter
    if (!isNaN(Number(minYear))) {
      results = results.filter((b) => b.publishedYear >= (minYear as number));
    }
    if (!isNaN(Number(maxYear))) {
      results = results.filter((b) => b.publishedYear <= (maxYear as number));
    }

    // Sorting
    const [sortFieldRaw, sortDirRaw] = sort.split(":");
    const sortField = sortFieldRaw || "publishedYear";
    const sortDir = (sortDirRaw || "desc").toLowerCase();
    const allowedSortFields = new Set([
      "title",
      "publishedYear",
      "createdAt",
      "updatedAt",
    ]);
    if (!allowedSortFields.has(sortField)) {
      throw new ApiError(400, `Invalid sort field: ${sortField}`);
    }

    results.sort((a, b) => {
      let av: any = (a as any)[sortField];
      let bv: any = (b as any)[sortField];
      // normalize dates
      if (av instanceof Date) av = av.getTime();
      if (bv instanceof Date) bv = bv.getTime();
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    res.json({
      data: paged,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
