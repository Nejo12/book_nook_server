import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';

import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from '../helpers/apiError';
import Book from '../models/Book';
import Borrow from '../models/Borrow';
import BookService from '../services/book';

interface ICreateBookBody {
  title?: string;
  isbn?: string;
  author?: string;
  copies?: number;
  description?: string;
  publishedDate?: Date;
  publisher?: string;
}

const allBooks: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json(await BookService.findAllBooks());
  } catch (err: any) {
    next(new NotFoundError('Could not find any book.', err));
  }
};

const createBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    isbn,
    author,
    copies,
    description,
    publishedDate,
    publisher,
  }: ICreateBookBody = req.body;
  try {
    if (!title) next(new BadRequestError('New Book must have a title.'));
    if (!isbn) next(new BadRequestError('New Book must have an ISBN.'));
    if (!author) next(new BadRequestError('New Book must have an Author.'));
    if (!copies)
      next(new BadRequestError('New Book must have number of copies.'));
    const book = new Book({
      title,
      isbn,
      author,
      copies,
      description,
      publishedDate,
      publisher,
    });

    await BookService.createBook(book);
    res.json({ msg: 'Book created successfully', book });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('invalid Request', err));
    } else {
      next(new InternalServerError('Internal Server Error', err));
    }
  }
};

const getBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bookId = req.params.bookId as string;
  const userId = req.query.userId as string;
  let isBorrowed = false;
  let _borrow = null;

  const book = await BookService.findBookById(bookId);
  if (
    typeof req.query['userId'] !== 'undefined' &&
    req.query.userId !== 'undefined'
  ) {
    if (book) {
      const borrow = await Borrow.find({
        userId,
        bookId,
      });
      if (borrow.length > 0) {
        isBorrowed = true;
        _borrow = borrow;
      }
    } else {
      return res.status(404).json({ error: 'No book found' });
    }
  }
  if (!mongoose.isValidObjectId(bookId)) {
    next(new NotFoundError('Invalid book id'));
  }
  return res.json({ book, isBorrowed, borrow: _borrow });
};

const updateBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const update = req.body;
    const bookId = req.params.bookId;
    const updatedBook = await BookService.updateBook(bookId, update);
    res.json({ msg: 'Book updated successfully', updatedBook });
  } catch (err: any) {
    next(new NotFoundError('Book Not Found', err));
  }
};

const deleteBook: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await BookService.deleteBook(req.params.bookId);
    return res.status(204).json({ msg: 'Book entry deleted successfully' });
  } catch (err: any) {
    next(new NotFoundError(' Book not found', err));
  }
};

export default { allBooks, createBook, getBook, updateBook, deleteBook };
