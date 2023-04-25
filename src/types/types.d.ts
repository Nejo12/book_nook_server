import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      logOut: () => void;
      flash: (string) => void;
      user: string;
    }
  }
}

type BookDocument = Document & {
  title: string;
  isbn: string;
  author: string;
  copies: number;
  description: string;
  publishedDate: Date;
  publisher: string;
};

type UserDocument = Document &
  IUser & {
    generateAuthToken: () => void;
  };

type IUser = Document & {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

type BorrowDocument = Document & {
  bookId: string;
  userId: string;
  timestamp: boolean;
};

type Errors = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
