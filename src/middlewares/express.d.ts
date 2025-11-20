import { Request } from 'express';
import { JwtPayload } from '../middlewares/auth.middleware';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}