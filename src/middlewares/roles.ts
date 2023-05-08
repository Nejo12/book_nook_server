import { Request, Response, NextFunction } from 'express';
import { AccessControl } from 'accesscontrol';

import { InternalServerError } from '../helpers/apiError';

const ac = new AccessControl();

const roles = (function () {
  // Basic user can read his/her profile as well as update
  ac.grant('basic').readOwn('profile').updateOwn('profile');

  // ac.grant('supervisor').extend('basic').readAny('profile')
  // Admin can do all that the basic user can, plus, update, delete, etc
  ac.grant('admin')
    .extend('basic')
    .readAny('profile')
    .createOwn('profile')
    .updateAny('profile')
    .deleteAny('profile');

  return ac;
})() as any;

// Allows only users with certain roles access to the route
const grantAccess = function (action: string, resource: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqClone: any = { ...req }; // cloned req since it does not come with user props
      const permission = roles.can(reqClone.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action",
        });
      }
      next();
    } catch (err: any) {
      next(new InternalServerError('Internal Server Error', err));
    }
  };
};

// Filters and only grant access to users that are logged in
const allowIfLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.loggedInUser; // Holds the details of the logged-in user
    if (!user)
      return res
        .status(401)
        .json({ error: 'You need to be logged in to access this route' });
    req.user = user;

    next();
  } catch (err: any) {
    next(new InternalServerError('Internal Server Error', err));
  }
};

export default { roles, allowIfLoggedIn, grantAccess };
