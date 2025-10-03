import { AuthenticatedUser } from "src/common/interface/auth.interface";

declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
  }
}
