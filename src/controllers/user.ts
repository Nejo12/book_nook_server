import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError';
import User from '../models/User';
import { UserDocument } from '../types/types';
import UserService from '../services/user';
import validateLoginInput from '../helpers/login';
import validateRegisterInput from '../helpers/register';

const secret = Buffer.from(process.env.JWT_SECRET).toString('base64');
// Register new user
const register = async (req: Request, res: Response, next: NextFunction) => {
  // bring in custom validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = 'basic',
    }: UserDocument = req.body;

    // Check if user already exists
    const exists = await UserService.findUserByEmail(email);

    if (exists) {
      next(new BadRequestError('Provided eMail already exists.'));
    } else {
      // else create a new user, with token.
      // but first, create an instance of the User Model with the new input info
      const user = new User({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      await UserService.createUser(user);

      const token = user.generateAuthToken();
      return res
        .status(200)
        .send({ msg: 'Registration Successful.', user, token });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Registration Failed.', errors }); // return custom errors for frontend usage
    // next(new BadRequestError())
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Login a registered user
  try {
    const { email, password }: UserDocument = req.body;

    // Check if email is not registered
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .send({ msg: 'Login failed! Check the credentials.' });
    }

    // Check if password matches with one registered
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ msg: 'Login failed!  Check the credentials!' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      secret,
      {
        expiresIn: 3600000, // TODO: change to 1n hour before deployment
      },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: 'Login Successful!', user, token }); // Send just the token for frontend to make request with
      },
    );
    // const token = await user.generateAuthToken()
    // return res.send({ user, token })
  } catch (err) {
    next(new InternalServerError('Internal Server Error!'));
  }
};

// Get all registered users
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserService.findUsers();
  res.status(200).json({ data: users });
};

// Get one registered users
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (await UserService.findUser(
      req.params.userId,
    )) as UserDocument;

    if (!user) return next(new NotFoundError('User does not exist!'));
    res.status(200).json({ data: user });
  } catch (err) {
    next(new InternalServerError('Internal Server Error!'));
  }
};

// Update registered User's credentials
const updateCredentials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const update = req.body;
    const { userId } = req.params;

    const updatedUserCredentials = await UserService.updateCredentials(
      userId,
      update,
    );
    res.status(200).json({
      msg: 'Credential successfully updated.',
      data: {
        user: updatedUserCredentials,
      },
    });
  } catch (err) {
    next(new NotFoundError('User not found.'));
  }
};

// Delete registered User's credentials
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    await UserService.deleteUser(userId);
    res.status(204).json({ msg: 'User has been deleted!' });
  } catch (err) {
    next(new InternalServerError('Internal Server Error!!'));
  }
};

// Log out
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.logOut();
    req.flash('Success. Logged out successfully.');
    res.redirect('/users/login');
  } catch (err: unknown) {
    next(new InternalServerError('Internal Server Error.'));
  }
};

export default {
  register,
  login,
  getUsers,
  getUser,
  updateCredentials,
  deleteUser,
  logout,
};
