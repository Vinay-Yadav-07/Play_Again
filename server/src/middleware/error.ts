import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  const isDev = process.env.NODE_ENV === 'development';
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  // Log error without exposing sensitive info
  console.error(`[ERROR] ${req.method} ${req.url} - ${status}: ${message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    error: status === 500 && !isDev ? 'An unexpected internal server error occurred' : message,
    ...(isDev && { stack: err.stack }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
