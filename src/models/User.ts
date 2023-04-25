import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IUser, UserDocument } from '../types/types';

const secret = Buffer.from(process.env.JWT_SECRET).toString('base64');

const userSchema = new Schema({
  googleId: { type: 'String' }, // set in prep for google login
  firstName: {
    type: String,
    trim: true,
    minLength: 2,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    trim: true,
    minLength: 2,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'eMail is required'],
  },
  password: {
    type: String,
    minLength: 6,
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'admin'],
  },
});

userSchema.pre<IUser>('save', async function (next) {
  // Hash password if it is new (or modified) before saving the user model
  const user = this as UserDocument;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // generate an auth token for the user
  const token = jwt.sign({ user: this }, secret);
  return token;
};

userSchema.statics.findByCredentials = async function (
  email: string,
  password: string,
) {
  // Search for a user by email.
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Unable to find the user');
  }

  // If user is found, check the password if they match
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  return user;
};

export default model<UserDocument>('User', userSchema);
