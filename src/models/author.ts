export interface Author {
  id: string;
  name: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
export const authors: Author[] = [];

// Author methods
export const findAuthorById = (id: string): Author | undefined => {
  return authors.find((author) => author.id === id);
};

export const createAuthor = (
  authorData: Omit<Author, "id" | "createdAt" | "updatedAt">
): Author => {
  const newAuthor: Author = {
    id: Date.now().toString(),
    ...authorData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  authors.push(newAuthor);
  return newAuthor;
};

export const updateAuthor = (
  id: string,
  authorData: Partial<Omit<Author, "id" | "createdAt" | "updatedAt">>
): Author | null => {
  const authorIndex = authors.findIndex((author) => author.id === id);
  if (authorIndex === -1) return null;

  authors[authorIndex] = {
    ...authors[authorIndex],
    ...authorData,
    updatedAt: new Date(),
  };

  return authors[authorIndex];
};

export const deleteAuthor = (id: string): boolean => {
  const authorIndex = authors.findIndex((author) => author.id === id);
  if (authorIndex === -1) return false;

  authors.splice(authorIndex, 1);
  return true;
};
