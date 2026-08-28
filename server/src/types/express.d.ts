import { AuthUser } from '../model/auth';

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export {};