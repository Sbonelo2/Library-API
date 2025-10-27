import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

export type ErrorDetails = Record<string, unknown> | string[] | string;

export class ApiError extends Error {
  public details?: ErrorDetails;
  public code?: string; // machine-friendly code

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    details?: ErrorDetails
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    // keep stack
  }

  // allow reading statusCode as property
  public statusCode: number;
}

// Not-found handler: forward a 404 ApiError
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new ApiError(
      404,
      `Route ${req.method} ${req.originalUrl} not found`,
      "not_found"
    )
  );
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Normalize error
  let status = 500;
  let message = "Internal Server Error";
  let code: string | undefined;
  let details: ErrorDetails | undefined;

  if (err instanceof ApiError) {
    status = err.statusCode || 500;
    message = err.message || message;
    code = err.code;
    details = err.details;
  } else if (err instanceof Error) {
    // generic error
    message = err.message || message;
  }

  const payload: any = {
    error: {
      message,
      status,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    },
  };

  if (code) payload.error.code = code;
  if (details) payload.error.details = details;

  // Include stack in non-production for debugging
  if (process.env.NODE_ENV !== "production" && err instanceof Error) {
    payload.error.stack = err.stack;
  }

  res.status(status).json(payload);
};
