import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { BadRequestError, UnauthorizedError } from '../helpers/apiError';

const secret = Buffer.from(process.env.JWT_SECRET).toString('base64');

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return next(new UnauthorizedError());

  try {
    const verified = jwt.verify(authHeader, secret) as jwt.JwtPayload;
    req.user = verified.user;
    next();
  } catch (err) {
    next(new BadRequestError('Invalid token'));
  }
};

export default auth;
