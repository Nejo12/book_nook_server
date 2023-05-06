import { Request, Response, NextFunction } from 'express';

import { BadRequestError, NotFoundError } from '../helpers/apiError';
import BorrowService from '../services/borrow';
import BookService from '../services/book';
import Borrow from '../models/Borrow';
import Book from '../models/Book';

const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, bookId } = req.body;

  // Check if book is already in borrow list
  const book = await BorrowService.findBorrowedBookByUserId(
    req.body.userId,
    req.body.bookId,
  );
  if (book) {
    return res
      .status(400)
      .json({ error: 'Book is already on your borrowed list' });
  }

  // Check book limit in user's borrow list
  const books = await BorrowService.findBorrowedBooksByUserId(userId);
  if (books.length >= 3) {
    return res.status(400).json({
      error: "You can't have more than 3 books in your borrowed list",
    });
  }

  // Check if the requested book is still available in Library
  // If not available in Library ...
  const _book = await BookService.findBookById(bookId);
  if (_book) {
    if (_book.copies <= 0) {
      return res.status(404).json({
        msg: 'Book is no longer available, all copies have been lent out!',
      });
    }

    const newCopies = _book.copies - 1;
    await Book.findByIdAndUpdate(req.body.bookId, {
      copies: newCopies,
    });

    await Borrow.create(req.body).then((book) => {
      return res.json({
        msg: 'Book added to library successfully',
        book: _book,
        borrow: book,
      });
    });
  } else {
    return next(new BadRequestError('No such book.!'));
  }
};

// Get all borrowed books by user
const getBorrowedBooks = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId: string = req.query.userId;
  const _bookList: any = [];
  const books = await Borrow.find({ userId });
  for (let i = 0; i < books.length; i++) {
    await Book.findById(books[i].bookId).then((r) => {
      _bookList.push({ books: r, borrowId: books[i]._id });
    });
  }
  return res.json(_bookList);
};

// Get specific borrowed book by user
const getBorrowedBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const book = await BorrowService.findBorrowedBookByUserId(
    req.params.userId,
    req.params.bookId,
  );
  if (!book) {
    next(new NotFoundError('Book not found'));
  }
  return res.json({ msg: 'Retrieved Successfully', book });
};

// Remove borrowed books from BorrowedList
const deleteBorrowedBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //Update book by bookId passed into the param
    const book = await BookService.findBookById(req.params.bookId);
    if (book) {
      const newCopies = book.copies + 1;
      await BookService.updateBook(req.params.bookId, {
        copies: newCopies,
      });
    }

    //Delete from borrowed list using borrow_id
    const { borrowId } = req.params;
    await BorrowService.deleteBorrowed(borrowId);
    return res.json({ msg: 'Book removed successfully' });
  } catch (err) {
    next(new NotFoundError('Book not found in borrowed books.'));
  }
};

export default {
  borrowBook,
  getBorrowedBook,
  getBorrowedBooks,
  deleteBorrowedBook,
};
