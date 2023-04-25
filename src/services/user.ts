import User from '../models/User';
import { UserDocument } from '../types/types';

const createUser = (user: UserDocument): Promise<UserDocument> => {
  return user.save();
};

const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  const user = await User.findOne({ email });
  return user;
};

const findUsers = async (): Promise<UserDocument[]> => {
  const users = await User.find({});
  return users;
};

const findUser = async (_id: string): Promise<UserDocument | null> => {
  const user = await User.findById({ _id }).exec();
  return user;
};

const findOrCreate = async (profile: any): Promise<UserDocument> => {
  const user = await User.findOne({ googleId: profile.id });

  if (!user) {
    const newUser = new User({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
    });

    newUser.save();
    return newUser;
  }
  return user;
};

const updateCredentials = async (
  userId: string,
  newCredential: Partial<UserDocument>,
) => {
  const { firstName, lastName, email, password } =
    newCredential as UserDocument;

  const user = (await User.findById(userId, newCredential)) as UserDocument;

  if (!user) {
    throw new Error('No such user');
  }
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (email) {
    user.email = email;
  }
  if (password) {
    user.password = password;
  }

  return user.save();
};

// to be used by admin
const deleteUser = (userId: string): Promise<UserDocument | null> => {
  return User.findByIdAndDelete(userId).exec();
};

export default {
  findOrCreate,
  updateCredentials,
  findUserByEmail,
  createUser,
  deleteUser,
  findUsers,
  findUser,
};
