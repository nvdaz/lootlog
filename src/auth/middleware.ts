import { Request, Response, NextFunction } from 'express';
import jwt, { UnauthorizedError } from 'express-jwt';

export const jwtParser = jwt({
  credentialsRequired: false,
  secret: process.env.JWT_SECRET,
  getToken: ({
    headers: { authorization },
    cookies: { token },
  }: Request): string => authorization?.split(' ')[1] || token,
});

export const handleJwtError = (
  err: UnauthorizedError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => next(err?.code !== 'invalid_token' && err);

export const handlePassportError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => next();
