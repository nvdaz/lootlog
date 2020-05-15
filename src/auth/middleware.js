import jwt from 'express-jwt';

export const jwtParser = jwt({
  credentialsRequired: false,
  secret: process.env.JWT_SECRET,
  getToken: ({ headers: { authorization }, cookies: { token } }) =>
    authorization?.split(' ')[1] || token,
});

export const handleJwtError = (err, req, res, next) =>
  next(err.code !== 'invalid_token' && err);

export const handlePassportError = (err, req, res, next) => next();
