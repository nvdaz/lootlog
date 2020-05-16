/* eslint-disable @typescript-eslint/interface-name-prefix */
declare global {
  namespace Express {
    type User = IUser;
    interface Request {
      user?: IUser;
    }
  }
}
