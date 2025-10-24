import { findAuthorById } from "./author";
import { ApiError } from "../middleware";

export interface Book {
  id: string;
  title: string;
  authorId: string;
  isbn: string;
  publishedYear: number;
  genre?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
export const books: Book[] = [];

// Book methods
export const findBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id);
};

export const findBooksByAuthorId = (authorId: string): Book[] => {
  return books.filter((book) => book.authorId === authorId);
};

export const createBook = (
  bookData: Omit<Book, "id" | "createdAt" | "updatedAt">
): Book => {
  // Verify author exists
  const authorExists = findAuthorById(bookData.authorId);
  if (!authorExists) {
    throw new ApiError(400, "Author not found");
  }

  const newBook: Book = {
    id: Date.now().toString(),
    ...bookData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  books.push(newBook);
  return newBook;
};

export const updateBook = (
  id: string,
  bookData: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>
): Book | null => {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex === -1) return null;

  // If authorId is being updated, verify the new author exists
  if (bookData.authorId) {
    const authorExists = findAuthorById(bookData.authorId);
    if (!authorExists) {
      throw new ApiError(400, "Author not found");
    }
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...bookData,
    updatedAt: new Date(),
  };

  return books[bookIndex];
};

export const deleteBook = (id: string): boolean => {
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex === -1) return false;

  books.splice(bookIndex, 1);
  return true;
};
